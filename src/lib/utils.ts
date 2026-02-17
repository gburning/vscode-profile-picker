import { readFile } from "node:fs/promises"
import { parse, type ParseError } from "jsonc-parser"

/**
 * Reads file at path and returns parsed JSONC
 * @param path File path to read and parse as JSON-C file
 * @returns
 */
export async function readJsonFile(path: string) {
    const raw = await readFile(path, "utf8")

    const errors: ParseError[] = []
    const res = parse(raw, errors)

    if (errors.length) {
        throw new Error(
            `Parser failed with errors:\n\n${JSON.stringify(errors, undefined, 4)}`,
        )
    }

    return res
}
