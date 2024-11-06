const rfc6902 = require("rfc6902");

export default {
  createJsonPatch(baseJsonDoc, changedJsonDoc) {
    const baseFiltered = filterEmptyStrings(baseJsonDoc);
    const changedFiltered = filterEmptyStrings(changedJsonDoc);

    const patch = rfc6902.createPatch(baseFiltered, changedFiltered);

    console.log(patch);
    return patch;
  },

  applyJsonPatch(objectToApplyPatch, patches) {
    rfc6902.applyPatch(objectToApplyPatch, patches);
  }
};

function filterEmptyStrings(jsonDoc) {
  if (Array.isArray(jsonDoc)) {
    return jsonDoc.map(obj => filterEmptyStrings(obj));
  } else if (typeof jsonDoc === "object" && jsonDoc !== null) {
    const filtered = {};
    for (const [key, value] of Object.entries(jsonDoc)) {
      if (value !== "") {
        filtered[key] = filterEmptyStrings(value);
      }
    }
    return filtered;
  } else {
    return jsonDoc;
  }
}
