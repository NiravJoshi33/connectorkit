/**
 * Basic instruction decoder
 * Decodes common instruction types for display
 */

import { getShortProgramName } from './program-names';

export interface DecodedInstruction {
    index: number;
    programId: string;
    programName: string;
    instructionName: string;
    data?: string;
}

/**
 * Instruction type from Solana Kit getTransaction with jsonParsed encoding
 */
interface SolanaKitInstruction {
    programId?: string;
    program?: string;
    parsed?: {
        type?: string;
        info?: any;
    };
    data?: string | number[];
    accounts?: string[];
}

/**
 * Decode instruction to readable format
 * Works with Solana Kit transaction structure (jsonParsed encoding)
 */
export function decodeInstruction(
    instruction: SolanaKitInstruction | any,
    index: number
): DecodedInstruction {
    // Extract programId - could be 'programId' or 'program' field
    const programId = instruction.programId || instruction.program || 'unknown';
    const programIdStr = typeof programId === 'string' ? programId : String(programId);
    const programName = getShortProgramName(programIdStr);

    // Handle parsed instructions (Token, System, etc.)
    if ('parsed' in instruction && typeof instruction.parsed === 'object') {
        const parsed = instruction.parsed as any;
        const instructionType = parsed.type || 'Unknown';
        
        return {
            index: index + 1,
            programId: programIdStr,
            programName,
            instructionName: formatInstructionType(instructionType),
        };
    }

    // Handle partially decoded instructions with data
    if ('data' in instruction) {
        const data = instruction.data;
        const dataStr = typeof data === 'string' ? data : 
                       Array.isArray(data) ? data.join(',') : 
                       undefined;
        
        return {
            index: index + 1,
            programId: programIdStr,
            programName,
            instructionName: 'Unknown Instruction',
            data: dataStr,
        };
    }

    return {
        index: index + 1,
        programId: programIdStr,
        programName,
        instructionName: 'Unknown',
    };
}

/**
 * Format instruction type for display
 * Converts camelCase to Title Case
 */
function formatInstructionType(type: string): string {
    // Handle common patterns
    const formatted = type
        // Insert space before capital letters
        .replace(/([A-Z])/g, ' $1')
        // Capitalize first letter
        .replace(/^./, str => str.toUpperCase())
        // Clean up multiple spaces
        .replace(/\s+/g, ' ')
        .trim();

    return formatted;
}

/**
 * Get instruction display name for UI
 */
export function getInstructionDisplayName(instruction: DecodedInstruction): string {
    return `${instruction.instructionName} (${instruction.programName})`;
}

