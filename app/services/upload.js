import {
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
} from '@remix-run/node';

export default unstable_composeUploadHandlers(
  unstable_createFileUploadHandler({
    directory: 'public/uploads',
    filter(file) {
      // Matcher for empty files
      if (
        file.filename === '' &&
        file.encoding === '7bit' &&
        file.mimetype === 'application/octet-stream'
      ) {
        return false;
      }
      return true;
    },
  }),
  unstable_createMemoryUploadHandler()
);
