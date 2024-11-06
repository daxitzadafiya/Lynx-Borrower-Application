# lynx-borrower-application

## Project setup
```
npm install
```

### Compiles and hot-reloads for development and targeting a specific brand 
```
npm run serve:software-lynx
```

### Compiles and minifies for production and targeting a specific brand
```
npm run build:software-lynx
```

### Lints and fixes files
```
npm run lint
```

### Run your unit tests
```
npm run test:unit
```

# Deployment to AWS s3 Bucket  
```
aws s3 cp ./dist s3://staging-borrowerapplication.softwarelynx.com --recursive --acl public-read 
```

# AWS Cloudfront Invalidation. This clears the cash on the edge servers so the newly build and deployed files are served  
```
aws cloudfront create-invalidation --distribution-id E2M0AADBYSKIGC --paths "/*"
```
