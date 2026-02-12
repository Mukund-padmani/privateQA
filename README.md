# Private Knowledge Q&A

A web application that allows users to upload text documents and ask questions about their content. The system uses a RAG (Retrieval-Augmented Generation) approach to find relevant information and provide answers with citations.

## Features
- **Document Management**: Upload and view text files.
- **Q&A Interface**: Ask questions in natural language.
- **Source Citation**: See exactly which document and section provided the answer.
- **Privacy Focused**: Documents are processed locally or securely.

## Technical Architecture
- **Frontend**: customized HTML/CSS/JS (Vite + React recommended for state management).
- **Processing**:
    - **Ingestion**: Split uploaded text into chunks.
    - **Retrieval**: Find relevant chunks based on question keywords/semantics.
    - **Generation**: Use an LLM (or a local string matcher/simple model) to extract the answer from the chunks.
