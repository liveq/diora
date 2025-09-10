# EmailJS 설정 가이드

문의 폼을 실제로 작동시키려면 EmailJS 계정을 설정해야 합니다.

## 설정 단계:

1. **EmailJS 계정 생성**
   - https://www.emailjs.com/ 접속
   - 무료 계정 생성 (월 200건 무료)

2. **이메일 서비스 연결**
   - Dashboard → Email Services → Add New Service
   - Gmail, Outlook 등 선택
   - 서비스 연결 후 Service ID 저장

3. **이메일 템플릿 생성**
   - Dashboard → Email Templates → Create New Template
   - 템플릿 내용 설정:
   ```
   제목: 새로운 문의: {{from_name}}
   
   보낸 사람: {{from_name}}
   이메일: {{user_email}}
   연락처: {{user_phone}}
   
   문의 내용:
   {{message}}
   ```
   - Template ID 저장

4. **Public Key 확인**
   - Dashboard → Account → API Keys
   - Public Key 복사

5. **환경 변수 설정**
   `.env` 파일 생성:
   ```
   REACT_APP_EMAILJS_SERVICE_ID=your_service_id
   REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id
   REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key
   ```

6. **Contact.tsx 파일의 주석 해제**
   - 현재 주석 처리된 EmailJS 코드를 활성화
   - 환경 변수가 설정되면 자동으로 이메일 전송 기능 작동

## 테스트
- 폼 작성 후 제출
- 설정한 이메일로 문의 내용 수신 확인