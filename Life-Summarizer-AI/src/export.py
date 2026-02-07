from security import decrypt_data

def export_csv(output="data/export.csv"):
    df = decrypt_data("data/journal_entries.csv")
    df.to_csv(output, index=False)
    print(f"Decrypted dataset exported to {output}")
