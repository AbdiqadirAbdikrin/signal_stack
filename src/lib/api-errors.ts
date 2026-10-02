import { NextResponse } from "next/server";

/**
 * An error whose message and status are safe to send to an API client.
 *
 * Anything thrown that is NOT an ApiError is treated as an internal failure: the
 * detail is logged on the server and the client receives a generic message. This is
 * what keeps PostgreSQL and PostgREST internals (enum names, table and column names,
 * constraint names, filter-parser errors) out of API responses.
 */
export class ApiError extends Error {
    readonly status: number;

    constructor(message: string, status = 500, detail?: string) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.detail = detail;
    }

    /** Unredacted database/driver detail. Server-side logs only. */
    readonly detail?: string;
}

/**
 * Wraps a database driver error so the client never sees the driver's own message.
 * The original detail is logged and kept on the error for server-side debugging.
 */
export function internalError(context: string, detail: string, status = 500): ApiError {
    console.error(`[api-errors] ${context}: ${detail}`);

    return new ApiError("Something went wrong while processing the request.", status, detail);
}

/**
 * Parses a JSON request body that must be a plain object.
 *
 * Malformed JSON, `null`, primitives and arrays are all rejected with 400 instead of
 * escaping as a 500, and the parser's own message is never returned to the client.
 */
export async function readJsonObjectBody(request: Request): Promise<Record<string, unknown>> {
    let parsed: unknown;

    try {
        parsed = await request.json();
    } catch {
        throw new ApiError("Invalid JSON body.", 400);
    }

    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new ApiError("Invalid JSON body.", 400);
    }

    return parsed as Record<string, unknown>;
}

/**
 * Converts a caught error into a JSON response.
 *
 * ApiError instances carry their own safe message and status. Everything else is
 * logged and answered with a generic 500.
 */
export function toErrorResponse(error: unknown, fallbackMessage: string): NextResponse {
    if (error instanceof ApiError) {
        if (error.detail) {
            console.error(`[api-errors] ${error.message}: ${error.detail}`);
        }

        return NextResponse.json({ message: error.message }, { status: error.status });
    }

    console.error(`[api-errors] unhandled: ${error instanceof Error ? error.message : String(error)}`);

    return NextResponse.json({ message: fallbackMessage }, { status: 500 });
}