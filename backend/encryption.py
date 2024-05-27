from cryptography.fernet import Fernet
import os

def generate_key():
    return Fernet.generate_key()

def encrypt_file(filepath, output_folder):
    key = generate_key()
    fernet = Fernet(key)
    
    with open(filepath, 'rb') as file:
        original = file.read()
        
    encrypted = fernet.encrypt(original)
    encrypted_filepath = os.path.join(output_folder, os.path.basename(filepath))
    
    with open(encrypted_filepath, 'wb') as encrypted_file:
        encrypted_file.write(encrypted)
        
    return key.decode()

def decrypt_file(encrypted_filepath, output_filepath, key):
    fernet = Fernet(key.encode())
    
    with open(encrypted_filepath, 'rb') as encrypted_file:
        encrypted = encrypted_file.read()
        
    decrypted = fernet.decrypt(encrypted)
    
    with open(output_filepath, 'wb') as decrypted_file:
        decrypted_file.write(decrypted)
