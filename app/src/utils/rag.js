export const processFile = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            const chunks = createChunks(content);
            resolve({
                id: crypto.randomUUID(),
                name: file.name,
                type: file.type,
                size: file.size,
                content,
                chunks
            });
        };
        reader.onerror = (error) => reject(error);
        reader.readAsText(file);
    });
};

const createChunks = (text, maxLength = 1000) => {
    const lines = text.split('\n');
    const chunks = [];
    let currentChunk = '';
    let currentId = 0;

    lines.forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed) return;
        const isHeader = trimmed.startsWith('#') || (trimmed.length < 50 && trimmed.endsWith(':'));
        const isList = trimmed.startsWith('-') || trimmed.startsWith('*') || /^\d+\./.test(trimmed);
        if (isHeader) {
            if (currentChunk) {
                chunks.push({ id: `chunk-${currentId++}`, text: currentChunk.trim() });
            }
            currentChunk = trimmed;
        } else if (isList) {
            currentChunk = currentChunk ? currentChunk + '\n' + trimmed : trimmed;
        } else {
            if (currentChunk.length > 200) {
                chunks.push({ id: `chunk-${currentId++}`, text: currentChunk.trim() });
                currentChunk = trimmed;
            } else {
                currentChunk = currentChunk ? currentChunk + '\n' + trimmed : trimmed;
            }
        }
    });
    if (currentChunk) {
        chunks.push({ id: `chunk-${currentId++}`, text: currentChunk.trim() });
    }

    return chunks;
};

export const searchKnowledgeBase = (query, documents) => {
    if (!query || documents.length === 0) return [];

    const searchTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
    const results = [];

    documents.forEach(doc => {
        doc.chunks.forEach(chunk => {
            let score = 0;
            const lowerText = chunk.text.toLowerCase();
            searchTerms.forEach(term => {
                if (lowerText.includes(term)) {
                    score += 20;
                    if (lowerText.indexOf(term) < 20) score += 5;
                }
            });
            const foundTerms = searchTerms.filter(term => lowerText.includes(term));
            if (foundTerms.length === searchTerms.length && searchTerms.length > 1) {
                score += 50;
            }

            if (score > 0) {
                const answerText = extractRelevantLines(chunk.text, searchTerms);
                results.push({
                    score,
                    text: answerText,
                    fullText: chunk.text,
                    docName: doc.name,
                    sourceId: doc.id,
                    chunkId: chunk.id
                });
            }
        });
    });

    const sorted = results?.sort((a, b) => b.score - a.score);

    if (sorted?.length > 0) {
        return [sorted[0]];
    }

    return [];
};

const extractRelevantLines = (text, searchTerms) => {
    const lines = text.split('\n');
    if (lines.length <= 1) return text;
    const scoredLines = lines.map(line => {
        let lineScore = 0;
        const lowerLine = line.toLowerCase();
        searchTerms.forEach(term => {
            if (lowerLine.includes(term)) lineScore += 1;
        });
        return { line, score: lineScore };
    });
    const bestLines = scoredLines.filter(l => l.score > 0);
    if (bestLines.length === 0) return text;
    return bestLines.map(l => l.line).join('\n');
};
