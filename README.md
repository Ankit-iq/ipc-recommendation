# IPC Recommender System

## Overview

The IPC Recommender System is an AI-powered Flask web application that helps legal professionals, students, and researchers find relevant Indian Penal Code (IPC) sections using natural language queries. The system leverages BERT (Bidirectional Encoder Representations from Transformers) technology to understand semantic meaning and provide intelligent recommendations based on legal scenario descriptions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Web Framework**: Flask with Jinja2 templating engine
- **UI Framework**: Bootstrap 5.3.0 for responsive design and components
- **Icons**: Font Awesome 6.0.0 for consistent iconography
- **Client-side**: Vanilla JavaScript for interactive features including search functionality, form validation, and accessibility enhancements
- **Styling**: Custom CSS with CSS variables for theme consistency and responsive design

### Backend Architecture
- **Web Framework**: Flask application with modular route handling
- **Design Pattern**: Abstract base class pattern for recommender interfaces, allowing for extensible recommendation algorithms
- **Core Classes**:
  - `RecommenderInterface`: Abstract base class defining the contract for recommendation systems
  - `BertRecommender`: Concrete implementation using BERT models for semantic similarity
- **Data Processing**: Pickle-based serialization for model persistence and fast loading
- **Similarity Engine**: Cosine similarity using scikit-learn for finding relevant IPC sections

### Data Storage Solutions
- **Model Storage**: Pickle files containing preprocessed dataframes, tokenizers, and trained BERT models
- **Session Management**: Flask sessions with environment-based secret key configuration
- **Data Structure**: Pandas DataFrames for IPC section data with fields for Section, Offense, Chapter, and Description

### Authentication and Security
- **Session Security**: Environment variable-based session secret key with validation
- **Input Validation**: Server-side form validation and sanitization
- **Error Handling**: Comprehensive logging and graceful error handling for missing models or data

### Recommendation Engine
- **NLP Technology**: BERT-based semantic understanding for query processing
- **Similarity Matching**: Cosine similarity algorithms to match user queries with IPC sections
- **Ranking System**: Top-N recommendation system with configurable result limits
- **Fallback Handling**: Graceful degradation when models are unavailable

## External Dependencies

### Python Libraries
- **Flask**: Web framework for application structure and routing
- **scikit-learn**: Machine learning library for cosine similarity calculations
- **numpy**: Numerical computing for array operations and mathematical functions
- **pickle**: Python serialization for model and data persistence
- **sentence-transformers**: For embedding user queries into semantic vectors
- **torch**: Backend for transformer models

### Frontend Dependencies
- **Bootstrap 5.3.0**: CSS framework hosted via CDN for responsive UI components
- **Font Awesome 6.0.0**: Icon library hosted via CDN for visual consistency

### AI/ML Dependencies
- **BERT Models**: Transformer-based language models for semantic understanding (loaded from pickle files)
- **Tokenizers**: Text preprocessing components for BERT model input preparation

### Development Dependencies
- **Logging**: Python's built-in logging module for application monitoring and debugging

### Environment Configuration
- **SESSION_SECRET**: Required environment variable for Flask session security
- **Model Files**: External pickle files containing trained models and preprocessed data (`ipc_recommender.pkl`)
## Developers

Meet the team behind the IPC Recommender System:

| Developer           | Role                 | Image                             |
|---------------------|----------------------|-----------------------------------|
| Ankit Kumar Bhuyan  | Full-Stack Developer | ![Ankit](images/WhatsApp Image 2025-09-20 at 22.08.22_efd3e502.jpg)   |
| Pranita Bisoyi      | Frontend Developer   | ![Pranita](images/WhatsApp Image 2025-09-20 at 22.06.21_d0c12ac6.jpg) |

> Images should be hosted online (GitHub, Imgur, or your server) and linked here.
