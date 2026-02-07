def log_metrics(original_text: str, summary_text: str) -> dict:
    """
    Computes evaluation metrics for summarization output.
    """

    original_len = len(original_text.split())
    summary_len = len(summary_text.split())

    compression_ratio = round(
        summary_len / max(original_len, 1), 2
    )

    return {
        "original_length": original_len,
        "summary_length": summary_len,
        "compression_ratio": compression_ratio
    }
