# External File Printing - Ringtail 9.6.008
Extensions can customize the output of production print jobs by providing a URL for Ringtail to retrieve files. This is useful for extensions providing file annotation services that need to perform custom file transformation during print.

## Prerequisites
1. Add a `retrieveProductionFileUrl` parameter with a valid HTTP/S URL to the [extension's manifest](ExtensionManifest.md) during installation. This URL must be accessible by the Ringtail Processing Framework.
1. Use the `annotationSource` value provided by the [extension context](API.md#context) or the [external auth token](AuthWithJWTs.md) to flag documents for external printing. This instructs Ringtail to request files via the configured `retrieveProductionFileUrl` during production printing.

## File Request Communication
Here's the flow for extending Ringtail's production printing process:

1. The extension will annotatate a document page via a Connect API mutation and include the provided `annotationSource` parameter.

1. A Ringtail user will add the annotated document to a production, select the annotation type for inclusion, lock, and print the production.

1. Ringtail will make a GET request to the `retrieveProductionFileUrl` for each file with external source annotations.
   - Ringtail will pass along an [external auth token](AuthWithJWTs.md) with full [context and configuration information](AuthWithJWTs.md) via the Authorization header, if a `privateKey` is configured for the extension. This auth token includes case and user context information.
   - Ringtail will add a query string parameter `mainId` to the URL indicating which document to produce.

1. The extension will return:
   - HTTP status code of 200 (OK) if the file is ready and returned in the body of the response.
   - HTTP status code of 204 (No Content) if the file is not yet ready, indicating Ringtail should retry the request at a later time.
      - Use this response code to indicate the request is being successfully processed but the file is not yet ready.
      - Ringtail will retry file requests for approximately an hour. After that, Ringtail will mark the document as `Error Printing - External`.
   - Ringtail will mark the document as `Error Printing - External` if any other response is returned. Details about failed requests can be viewed in Task Error output of tasks of Produce Files stages of Production Printing jobs in the Processing area of the Ringtail portal.

1. Ringtail will write the returned file to the print output directory and update its rendition document so that the retrieved file shows in Ringtail.
