from utils.Google import Create_Service
import pandas as pd

#API 키 입력
CLIENT_SECRET_FILE = 'client_secret_22959203786-ettjuqkngl0jkjvcpc34kmqlhhna0ns3.apps.googleusercontent.com.json'
API_NAME = 'drive'
API_VERSION = 'v3'
SCOPES = ['https://www.googleapis.com/auth/drive.readonly']
service = Create_Service(CLIENT_SECRET_FILE, API_NAME, API_VERSION, SCOPES)

class Gdrive:
    def __init__(self, folder_id):
        print('Gdrive : Load ' + folder_id)
        query = f"parents = '{folder_id}'"
        response = service.files().list(q=query).execute()
        files = response.get('files')
        NextPageToken = response.get('nextPageToken')
        while NextPageToken:
            response = service.files().list(q=query).execute()
            files = response.get('files')
            NextPageToken = response.get('nextPageToken')
        self.df = pd.DataFrame(files)

    #아이디 불러오는 함수 정의
    def Get_File_Id_With_Name(self, filename):
        data = self.df.loc[self.df['name'] == filename]['id']
        string = ''
        for i in data:
            string = i
        return string

    def Get_Direct_File_URL(self, filename):
        file_id = self.Get_File_Id_With_Name(filename)
        return 'https://drive.google.com/uc?export=download&id=' + str(file_id)

    def Get_View_File_URL(self, filename):
        file_id = self.Get_File_Id_With_Name(filename)
        return 'https://drive.google.com/file/d/' + str(file_id) + '/preview'