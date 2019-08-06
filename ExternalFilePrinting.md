# External File Printing - Ringtail 10.5.006
Extensions can customize the output of production print jobs by providing a URL for Ringtail to use to retrieve files for production renditions, instead of using the files on the Ringtail file system for the corresponding base documents. This is useful for extensions that provide file annotation services and store the annotated or modified files remotely, because it allows the remotely stored version of the file to be the one used in production.

## Prerequisites
1. Add a `retrieveProductionFileUrl` parameter with a valid HTTP/S URL to the [extension's manifest](ExtensionManifest.md) during installation. This URL must be accessible by the Ringtail Processing Framework.
1. Use the `annotationSource` value provided by the [extension context](API.md#context) or the [external auth token](AuthWithJWTs.md) when adding an annotation to flag that the annotation requires external printing when the document is produced. This instructs Ringtail to request files via the configured `retrieveProductionFileUrl` during production printing.

## File Request Communication
Here's the flow for extending Ringtail's production printing process:

1. The extension annotatates a document page via a Connect API mutation and includes the provided `annotationSource` parameter.

1. A Ringtail user adds the annotated document to a production, selects the annotation type for inclusion, locks the production, and prints the production.

1. Ringtail makes a GET request to the `retrieveProductionFileUrl` for each file with external source annotations.
   - Ringtail passes along an [external auth token](AuthWithJWTs.md) with full [context and configuration information](AuthWithJWTs.md) via the Authorization header, if a `privateKey` is configured for the extension. This auth token includes case and user context information.
   - Ringtail adds a query string parameter `mainId` to the URL indicating which document to produce.

1. The extension returns:
   - HTTP status code of 200 (OK) if the file is ready and returned in the body of the response.
   - HTTP status code of 202 (Accepted) with a Location header set if the file is not ready yet, indicating that Ringtail should make a request to the specified location at a later time.  see [RFC 7240](https://tools.ietf.org/html/rfc7240#section-4.1)
      - Use this response code to indicate that the request is being successfully processed and the file should be retrieved at a different location.
      - Ringtail adds the same query string parameter `mainId` to the specified Location URL
      - The specified location should follow the same rules for http responses.
      - Ringtail will make a request to the specified location, and will rety file requests for approximately an hour.  After that, Ringtail will mark the document as `Error Printing - External`.
   - Ringtail marks the document as `Error Printing - External` if any other response is returned. You can view details about failed requests in the Portal Management > Processing section of Ringtail, under the relevant Production Printing job > Produce Files stage > Task ID > XML page, in the Task Error section.

1. Ringtail writes the returned file to the print output directory and updates the file's rendition document so that the retrieved file shows in Ringtail.