import nltk
import heapq
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
from collections import defaultdict

# Download once
try:
    nltk.data.find("tokenizers/punkt")
except LookupError:
    nltk.download("punkt")

try:
    nltk.data.find("corpora/stopwords")
except LookupError:
    nltk.download("stopwords")


def summarize_chunk(text, sentence_count=3):
    sentences = sent_tokenize(text)

    if len(sentences) <= sentence_count:
        return text

    words = word_tokenize(text.lower())
    stop_words = set(stopwords.words("english"))

    freq = defaultdict(int)
    for word in words:
        if word.isalnum() and word not in stop_words:
            freq[word] += 1

    if not freq:
        return text

    max_freq = max(freq.values())
    for word in freq:
        freq[word] /= max_freq

    sentence_scores = {}
    for sentence in sentences:
        for word in word_tokenize(sentence.lower()):
            if word in freq:
                sentence_scores[sentence] = sentence_scores.get(sentence, 0) + freq[word]

    top_sentences = heapq.nlargest(sentence_count, sentence_scores, key=sentence_scores.get)

    return " ".join(top_sentences)


def summarize_text(text, final_sentences=5):
    """
    Handles very large text by chunking.
    """

    if not text:
        return ""

    # Split huge text into chunks (approx 800 words each)
    words = text.split()
    chunk_size = 800
    chunks = []

    for i in range(0, len(words), chunk_size):
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)

    # Summarize each chunk
    partial_summaries = []
    for chunk in chunks:
        partial_summaries.append(summarize_chunk(chunk, 3))

    # Combine and summarize again
    combined_summary = " ".join(partial_summaries)

    final_summary = summarize_chunk(combined_summary, final_sentences)

    return final_summary