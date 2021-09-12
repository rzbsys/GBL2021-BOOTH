from flask import Flask, render_template, redirect, session, request, url_for
from pymongo import MongoClient
from datetime import timedelta
from utils.gdrive import Gdrive
import os, time


#시간 불러오기
def get_time():
    t = time.time()
    tm = time.localtime(t)
    string = time.strftime('%Y-%m-%d %I:%M:%S %p', tm)
    return string

app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(13).hex()
m_uri = "mongodb://gbl2021:Bc0cqRc8F8B2yQHzHQhYaDgkoWMEtf6VR5g4qm5dyljtjthj82EWrbvYRU0pKO1o5MqMIjrPAKuBP5tBxlK9Kw==@gbl2021.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&replicaSet=globaldb&maxIdleTimeMS=120000&appName=@gbl2021@"
client = MongoClient(m_uri, connect=False)
db = client['gbl2021']
thumnail_gdrive = Gdrive('1Fe5hwdPelmaV7aCi5TDvBGGQfCXtLv3Y')

#세션 기간 설정
@app.before_request
def make_session_permanent():
    session.permanent = True
    app.permanent_session_lifetime = timedelta(minutes=5)

#404 로그
def log_404(txt, ip):
    f = open('logs/404.txt', 'a')
    f.write('[{0} | {1}] {2}\n'.format(get_time(), ip, txt))
    f.close()


#404 오류 처리
@app.errorhandler(404)
def e1(msg):
    log_404('Access 404! Reason : ' + str(msg), request.remote_addr)
    return render_template('404.html', err_msg="정상적인 경로로 진입해주세요.", err_code=msg)

#500 Internal Server Error 처리
@app.errorhandler(500)
def e2(msg):
   log_404('Internal Server Error! Reason : ' + str(msg), request.remote_addr)
   return render_template('404.html', err_msg="서버 오류가 발생하였습니다.", err_code=msg)



#로그인, 메인화면 라우팅
@app.route('/')
def f1():
    if request.user_agent.string.lower().find('kakaotalk') != -1:
        return render_template('404.html', err_msg="카카오톡 브라우저는 지원하지 않습니다.", err_code="Safari 또는 Chrome에서 접속해주세요.")
    if request.user_agent.string.lower().find('windows') != -1:
        return render_template('404.html', err_msg="PC버전은 지원하지 않습니다.", err_code="PC not allowed")
    
    if not 'BID' in session:
        return render_template('login.html')
    else:
        bdata = list(db['booths'].find({'NUM':session['BID']}))[0]
        try:
            hist_data = bdata['HIST']
            last_key = list(hist_data.keys())[-1]
            last=hist_data[last_key]
            user_name = list(db['users'].find({'UID' : last['uid']}))[0]['NAME']
        except:
            user_name = '정보 없음'
            last = {
                'time':'시간정보 없음',
                'score':0
            }
        return render_template('main.html', bid=session['BID'], thumnail_gdrive=thumnail_gdrive, i=bdata, str=str, last=last, user_name=user_name)


@app.route('/login', methods=['POST'])
def f2():
    try:
        pw = request.form['PW']
    except:
        return redirect('/?msg=비밀번호 형식이 일치하지 않습니다.')
    login_db = list(db['admin'].find({'PW':pw}))
    if (len(login_db) == 0):
        return redirect('/?msg=비밀번호가 일치하지 않습니다.')
    
    session['BID'] = login_db[0]['BOOTH']
    session['BNAME'] = list(db['booths'].find({'NUM':session['BID']}))[0]['NAME']
    return redirect('/')
    
@app.route('/status', methods=['POST'])
def f3():
    stat = int(request.form['STAT'])
    db['booths'].update({'NUM': session['BID']},{'$set': {'STATUS': stat}}, upsert=False)    
    return {'res':'suc'}

@app.route('/camera')
def f4():
    return render_template('camera.html')


@app.route('/getname', methods=['POST'])
def f5():
    uid = request.form['UID']
    user_data = list(db['users'].find({'UID': uid}))[0]
    return {'name':user_data['NAME']}    

@app.route('/addscore', methods=['POST'])
def f6():
    uid = request.form['UID']
    score = int(request.form['SCORE'])
    user_data = list(db['users'].find({'UID': uid}))[0]['HIST']
    now_score = int(list(db['users'].find({'UID': uid}))[0]['SCORE'])
    name = 'ns' + str(len(user_data) + 1)
    
    # 검증
    if (len(user_data) > 10):
        return {'res':'최대 채험 가능 부스의 개수를 초과하였습니다.'}

    for i in user_data:
        print(i)
        if user_data[i]['uid'] == session['BID']:
            return {'res' : '똑같은 부스를 2번이상 체험할 수 없습니다.'}

    user_data[name] = {
        'name':session['BNAME'],
        'score':score,
        'time':get_time(),
        'uid':session['BID']
    }
    db['users'].update({'UID': uid},{'$set': {'HIST': user_data}}, upsert=False)    
    db['users'].update({'UID': uid},{'$set': {'SCORE': now_score + score}}, upsert=False)    

    booth_data = list(db['booths'].find({'NUM':session['BID']}))[0]['HIST']
    name = 'ns' + str(len(booth_data) + 1)
    booth_data[name] = {
        'score':score,
        'time':get_time(),
        'uid':uid
    } 
    db['booths'].update({'NUM': session['BID']},{'$set': {'HIST': booth_data}}, upsert=False)

    return {'res':'부스 정보 업데이트에 성공하였습니다.'}





if __name__ == '__main__':
    app.run('0.0.0.0', port=80, debug=True)

