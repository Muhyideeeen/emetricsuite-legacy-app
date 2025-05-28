The error you're encountering is related to Node.js using OpenSSL 3, which enforces stricter security policies that are not supported by some older versions of Webpack or other dependencies in your project. This issue is common with newer versions of Node.js, especially starting from version 17 and up.

To fix this issue, you have a few options:

### 1. **Set the Legacy OpenSSL Provider:**
   You can set the `NODE_OPTIONS` environment variable to use the legacy OpenSSL provider. Run the following command before your build command:
   
   ```bash
   export NODE_OPTIONS=--openssl-legacy-provider
   ```

   Then run your build command:
   
   ```bash
   yarn run build
   ```

### 2. **Upgrade Webpack:**
   If possible, upgrade Webpack and related dependencies to versions that are compatible with OpenSSL 3. This might involve updating your project's dependencies:

   ```bash
   yarn upgrade webpack webpack-cli
   ```

### 3. **Downgrade Node.js:**
   If the above solutions don't work, you can downgrade to an older version of Node.js (e.g., 16.x) which doesn't have this issue. You can manage Node.js versions using [nvm (Node Version Manager)](https://github.com/nvm-sh/nvm):

   ```bash
   nvm install 16
   nvm use 16
   ```

   After switching to Node.js 16, try running your build command again:

   ```bash
   yarn run build
   ```

### 4. **Modify the Webpack Configuration:**
   If you're using a custom Webpack configuration, you might need to modify it to ensure compatibility with OpenSSL 3. This could involve changes in the hashing algorithm used for creating hashes.

Let me know if you need further assistance with any of these steps!