import os

def delete_profile_picture(file_path):
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
    except Exception as e:
        raise Exception("Failed to delete profile_picture")
    