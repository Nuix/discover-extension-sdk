# Download Document Files
Extensions can download the files associated with documents.

A UIX can identify the file to download in the following ways:
- Download a file based on the file ID (9.6.002)
- Download a content file based on the content file type ranking (9.6.002)
- Download a page file based on the page file number (9.6.002)
- Download a page file as a .jpg or .png image (9.7.000)

## Usage notes
Note the following:
- This endpoint allows users to download files only through a UIX. Users cannot download files by calling the endpoint directly.
- A user can download a file though a UIX even if the security for the **Document - Download** option on the Case Home > Security > Features page in Ringtail is set to Deny for the user's group.
- A user cannot download a file associated with a document if the user does not have access to the document, or if the document contains branded redactions.
- Images are returned at 100% scale. This may result in large images being returned, particularly for documents that were scanned at a high DPI (dots per inch).

## Request format
### Endpoint
`POST /api/download`

### HTTP header
`Authorization: bearer {APIToken}`

where `{APIToken}` is the user's UIX session token. For more information, see `apiAuthToken` defined in [Ringtail.Context](API.md#context).

### Parameters

Depending on how the UIX identifies the file to download, the required parameters vary.

**To download a file based on the file ID:**
| Parameter | Description | Type | Required? | Notes |
| --- | --- | --- | --- | --- |
| caseId | Case ID. Identifies the case in the portal. | int | Required |  |
| fileId | File ID. Identifies the file in the case. | string | Required |  |

For example: http://ringtail.example.com/Ringtail-Svc-Portal/api/download?caseId=6078&fileId=29384

**To download a content file based on the content file type ranking:**
| Parameter | Description | Type | Required? | Notes |
| --- | --- | --- | --- | --- |
| caseId | Case ID. Identifies the case in the portal. | int | Required |  |
| mainId | Document Main ID. Identifies the document in the case. | int | Required |  |
| contentFileRank | Rank of the content file displayed in the View pane. | int | Required | The highest ranked content file has a `contentFileRank` of 1. |

For example: http://ringtail.example.com/Ringtail-Svc-Portal/api/download?caseId=3024&mainId=39456&contentFileRank=1

**To download a page file based on the page file number:**
| Parameter | Description | Type | Required? | Notes |
| --- | --- | --- | --- | --- |
| caseId | Case ID. Identifies the case in the portal. | int | Required |  |
| mainId | Document Main ID. Identifies the document in the case. | int | Required |  |
| pageFileNumber | Sequential order of the file among the document's page files. | int | Required |  |

For example: http://ringtail.example.com/Ringtail-Svc-Portal/api/download?caseId=201&mainId=99810&pageFileNumber=2

**To download a page file as a .jpg or .png image:**
| Parameter | Description | Type | Required? | Notes |
| --- | --- | --- | --- | --- |
| caseId | Case ID. Identifies the case in the portal. | int | Required |  |
| mainId | Document Main ID. Identifies the document in the case. | int | Required |  |
| pageId | Page ID. Identifies the page file in the case. | int | Required |  |
| pageNum | The number of the page that you want to return, for a page file that has multiple pages. | int | Required |  |
| imageFormat | The file type that you want to return the image as. Specify one of `jpg` or `png`. | string | Optional | Default is jpg. |

For example: http://ringtail.example.com/Ringtail-Svc-Portal/api/download?caseId=201&mainId=29384&pageId=1&pageNum=4&pageId=1&imageFormat=png

## Errors
403:
- The document contains images with branded redactions.
- The file exceeds the file download size limit. File size limits are set on the Portal Management > Portal Options page, using the View pane maximum file size option.
- Authentication was performed with a user's personal API token and key instead of a user's UIX session token.

404:
- The user whose token is associated with the request does not have access to the requested document in their current group security context.
- Required parameters are missing.