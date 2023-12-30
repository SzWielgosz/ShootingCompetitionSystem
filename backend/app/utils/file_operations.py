import os
from PIL import Image

def delete_profile_picture(file_path):
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
    except Exception as e:
        raise Exception("Nieudana próba usunięcia zdjęcia profilowego")
    
def is_image(file):
    try:
        Image.open(file)
        return True
    except Exception as e:
        return False