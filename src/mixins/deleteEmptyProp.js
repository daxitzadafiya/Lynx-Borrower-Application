export default {
    methods: {
        deleteEmptyProp (obj, prop) {
            if(!obj[prop] && Object.keys(obj).includes(prop)) delete obj[prop];
        },
        deletePropWithCondition(object, condition, [...deletions]) {
            deletions.forEach(i => {
            if (condition) {
                    delete object[i];
                }
                this.deleteEmptyProp(object, i)
            })
        }
    }
}