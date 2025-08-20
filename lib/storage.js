import fs from 'fs/promises';
import path from 'path';

/**
 * Read JSON data from a file
 * @param {string} filepath - Path to the JSON file
 * @returns {Promise<any>} Parsed JSON data
 */
export async function readJson(filepath) {
  try {
    const absolutePath = path.isAbsolute(filepath) 
      ? filepath 
      : path.join(process.cwd(), filepath);
    
    const data = await fs.readFile(absolutePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, return empty object/array depending on context
      return filepath.includes('approvals') ? {} : [];
    }
    throw error;
  }
}

/**
 * Write JSON data to a file atomically
 * @param {string} filepath - Path to the JSON file
 * @param {any} data - Data to write
 */
export async function writeJson(filepath, data) {
  try {
    const absolutePath = path.isAbsolute(filepath) 
      ? filepath 
      : path.join(process.cwd(), filepath);
    
    // Ensure directory exists
    const dir = path.dirname(absolutePath);
    await fs.mkdir(dir, { recursive: true });
    
    // Write to temporary file first for atomic operation
    const tempPath = `${absolutePath}.tmp`;
    await fs.writeFile(tempPath, JSON.stringify(data, null, 2), 'utf8');
    
    // Rename temp file to final path (atomic on most filesystems)
    await fs.rename(tempPath, absolutePath);
  } catch (error) {
    // Clean up temp file if it exists
    try {
      await fs.unlink(`${filepath}.tmp`);
    } catch {}
    throw error;
  }
}

/**
 * Update approvals data
 * @param {string} reviewId - Review ID
 * @param {boolean} approved - Approval status
 */
export async function updateApproval(reviewId, approved) {
  const approvalsPath = path.join(process.cwd(), 'data/approvals.json');
  const approvals = await readJson(approvalsPath);
  
  approvals[reviewId] = approved;
  await writeJson(approvalsPath, approvals);
  
  return approvals;
}
