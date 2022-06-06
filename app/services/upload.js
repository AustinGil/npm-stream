import { unstable_createFileUploadHandler } from '@remix-run/node';

export default unstable_createFileUploadHandler({
  directory: 'public/uploads',
});
