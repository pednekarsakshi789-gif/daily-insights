import torch
from transformers import T5Tokenizer, T5ForConditionalGeneration

# Device configuration (CPU / GPU)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load tokenizer and model once (model warm-up)
tokenizer = T5Tokenizer.from_pretrained("t5-small")
model = T5ForConditionalGeneration.from_pretrained("t5-small").to(device)
model.eval()

def summarize_text(text: str, max_length: int = 100) -> str:
    """
    Generates an abstractive summary using T5.
    Skips summarization for very short inputs.
    """

    if len(text.split()) < 30:
        return text

    input_text = "summarize: " + text

    inputs = tokenizer.encode(
        input_text,
        return_tensors="pt",
        truncation=True,
        max_length=512
    ).to(device)

    with torch.no_grad():
        summary_ids = model.generate(
            inputs,
            max_length=max_length,
            min_length=30,
            length_penalty=2.0,
            num_beams=4,
            early_stopping=True
        )

    return tokenizer.decode(summary_ids[0], skip_special_tokens=True)
