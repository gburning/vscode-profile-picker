import { resolve } from "node:path"
import { ExtensionContext } from "vscode"
import { readJsonFile } from "./utils"

/**
 * A profile's unique identifier (`__default__profile__` for the default profile).
 */
export type ProfileIdentifier = string

/**
 * Identifier for windows associated with a workspace. Seemingly always a `file://` URI.
 */
export type WorkspaceWindowIdentifier = string

/**
 * Identifier for empty windows. Known values:
 * - Creation timestamp in ms
 * - `ext-dev` for windows launched during extension development
 */
export type EmptyWindowIdentifier = string

export interface ProfileAssociations extends Record<string, unknown> {
    /** Mapping object for workspace windows ({@link WorkspaceWindowIdentifier} to {@link ProfileIdentifier}) */
    workspaces: Record<WorkspaceWindowIdentifier, ProfileIdentifier>
    /** Mapping object for empty windows ({@link EmptyWindowIdentifier} to {@link ProfileIdentifier}) */
    emptyWindows: Record<EmptyWindowIdentifier | "ext-dev", ProfileIdentifier>
}

export interface UserDataProfile extends Record<string, unknown> {
    /**
     * The profile's unique identifier (folder name in user data directory).
     */
    location: ProfileIdentifier
    /**
     * Profile name
     */
    name: string
    /**
     * Profile icon
     */
    icon: string
    /**
     * Controls which settings are inherited from the default profile.
     */
    useDefaultFlags: Record<string, boolean>
}

export interface GlobalStorage extends Record<PropertyKey, unknown> {
    profileAssociations: ProfileAssociations
    userDataProfiles: UserDataProfile[]
}

export async function getGlobalStorage(
    context: ExtensionContext,
): Promise<GlobalStorage> {
    // `globalStorageUri` points to this extension's directory; resolve up one level to get the editor-wide storage.
    const filePath = resolve(context.globalStorageUri.fsPath, "../storage.json")
    return readJsonFile(filePath)
}
