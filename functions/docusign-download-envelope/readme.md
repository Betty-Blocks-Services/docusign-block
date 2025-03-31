# DocuSign - Download Envelope File(s)

Download the files associated with an envelope.

## Prerequisites

- You have obtained an access token with [DocuSign - Get Access Token](../docusign-get-access-token/readme.md)
- You have created a sign request with [DocuSign - Create Sign Request](../docusign-get-access-token/readme.md)
- You have created a callback action: [Setting up a Callback Endpoint](/functions/docusign-create-sign-request/readme.md#setting-up-a-callback-endpoint)

## How to use

### Action (example)

If you've completed the steps for [Setting up a Callback Endpoint](/functions/docusign-create-sign-request/readme.md#setting-up-a-callback-endpoint) and you've created a sign request, you should have an updated `Envelope` record with the status `completed`.

1. Create a new action named `[DS] Download envelope`.

2. Open the `Settings` of the action.

3. Create a new input variable named `envelope_id` of type `TEXT`.

4. Navigate to the `Security` tab.

5. Toggle `PRIVATE ACTION`.

6. Select the appropriate `Authentication Profile`.

7. Configure the permissions for each of your roles.

8. Click `Save` and close the `Settings`.

9. Insert a condition and check if `envelope_id` exists.

10. In the first path of the condition, add another condition.

11. Open the `VARIABLES`-tab of the condition.

12. Insert a [Sub Action](https://my.bettyblocks.com/block-store/a390d91f-f284-4134-b854-38312e8297ff) to run `[DS] Refresh Access Tokens` and set the`RESULT` to `access_token`.

13. In the first path of the condition, add the `DocuSign - Download Envelope File(s)` step.

14. Configure the options:
    | OPTION | VALUE |
    |--------------- | --------------- |
    | BASE URL | `Configurations > DocuSign > Base URL` |
    | ACCOUNT ID | `Configurations > DocuSign > Account ID` |
    | ACCESS TOKEN | `access_tokens` |
    | ENVELOPE ID | `envelope_id` |
    | FILES TO FETCH | All documents as one PDF |
    | DOCUMENT ID | |
    | MODEL | `Document` |
    | PROPERTY | `file` |
    | RESULT AS | downloaded_envelope |

15. Insert a `Create Record` step to save the file in the `Document` model.
