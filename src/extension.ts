import * as vscode from "vscode"
import {
    getGlobalStorage,
    ProfileIdentifier,
    WorkspaceWindowIdentifier,
} from "./lib/storage"

export async function activate(context: vscode.ExtensionContext) {
    // Show the built-in profile picker when…
    // 1. …opening a new empty window
    // 2. …opening a workspace that uses the default profile
    if (!vscode.workspace.workspaceFolders) {
        vscode.commands.executeCommand(
            "workbench.profiles.actions.switchProfile",
        )
    } else {
        const {
            name,
            workspaceFolders: [workspaceFolder],
            workspaceFile,
        } = vscode.workspace

        // Get workspace window id from file or folder
        const workspaceId: WorkspaceWindowIdentifier =
            workspaceFile?.toString() ?? workspaceFolder.uri.toString()

        // Look up profile id in associations mapping
        const { profileAssociations } = await getGlobalStorage(context)
        const profileId: ProfileIdentifier =
            profileAssociations.workspaces[workspaceId]

        console.debug({
            workspaceId,
            profileAssociations,
            profileId,
        })

        if (!profileId) {
            let msg = "Could not find file or folder for workspace"
            if (name) {
                msg += ` with name "${name}"`
            }
            throw new Error(msg)
        }

        if (profileId === "__default__profile__") {
            vscode.commands.executeCommand(
                "workbench.profiles.actions.switchProfile",
            )
        }
    }

    const disposable = vscode.commands.registerCommand(
        "vscode-profile-picker.open",
        () => {
            vscode.commands.executeCommand(
                "workbench.profiles.actions.switchProfile",
            )
        },
    )

    context.subscriptions.push(disposable)
}

// This method is called when your extension is deactivated
export function deactivate() {}
