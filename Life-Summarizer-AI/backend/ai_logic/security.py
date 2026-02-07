from cryptography.fernet import Fernet
import os

KEY_PATH = "data/secret.key"

def get_key():
    if not os.path.exists(KEY_PATH):
        key = Fernet.generate_key()
        with open(KEY_PATH, "wb") as key_file:
            key_file.write(key)
    else:
        with open(KEY_PATH, "rb") as key_file:
            key = key_file.read()
    return key

def encrypt_data(data_frame, path):
    """Converts DataFrame to encrypted bytes and saves to disk."""
    key = get_key()
    fernet = Fernet(key)
    csv_text = data_frame.to_csv(index=False).encode()
    encrypted = fernet.encrypt(csv_text)
    with open(path, "wb") as f:
        f.write(encrypted)

def decrypt_data(path):
    """Reads encrypted file and returns a pandas DataFrame."""
    key = get_key()
    fernet = Fernet(key)
    with open(path, "rb") as f:
        encrypted = f.read()
    decrypted = fernet.decrypt(encrypted)
    import io
    import pandas as pd
    return pd.read_csv(io.BytesIO(decrypted))
def is_encrypted(file_path: str) -> bool:
    """
    Checks whether a file is already encrypted.
    """
    try:
        with open(file_path, "rb") as f:
            data = f.read()
        Fernet(get_key()).decrypt(data)
        return True
    except Exception:
        return False
