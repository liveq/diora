import React, { useState, useEffect, useMemo, useRef } from 'react';
import { database, auth } from '../firebase';  // 채팅용
import { contactDatabase, contactAuth } from '../firebaseContact';  // 문의용
import { ref, onValue, push, update, set } from 'firebase/database';
import { signInAnonymously } from 'firebase/auth';
import './AdminPage.css';
import './AdminInquiry.css';
import { Chat, SessionStatus, Message } from '../types/chat.types';
import { sendSessionNotification, sendAdminReplyNotification } from '../services/telegramNotifications';
import { localStorageManager } from '../services/localStorageManager';

type TabType = 'all' | SessionStatus | 'archived' | 'blocked';

interface AdminPageProps {}

const AdminPage: React.FC<AdminPageProps> = () => {
  {/* TODO: mode state 추가 */}
  const [mode, setMode] = useState<'chat' | 'inquiry'>('chat');
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [consultationNotes, setConsultationNotes] = useState<Array<{text: string, lastSaved?: Date}>>([{text: ''}]);
  const [isSaving, setIsSaving] = useState<number | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Toast 알림 표시
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 모드 전환 함수
  const switchMode = (newMode: 'chat' | 'inquiry', event: React.MouseEvent) => {
    event.preventDefault();
    setMode(newMode);
    if (newMode === 'inquiry') {
      loadInquiries();
    }
  };

  // 문의 데이터 로드
  const loadInquiries = async () => {
    try {
      // 인증 없이 바로 데이터 로드 (공개 읽기 권한)
      console.log('Loading inquiries from Contact Firebase...');
      const inquiriesRef = ref(contactDatabase, 'inquiries');
      onValue(inquiriesRef, (snapshot) => {
        const data = snapshot.val();
        console.log('Firebase inquiries data:', data);
        if (data) {
          const inquiriesList = Object.entries(data).map(([id, inquiry]: [string, any]) => ({
            id,
            ...inquiry,
            createdAt: inquiry.createdAt ? new Date(inquiry.createdAt) : new Date()
          })).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          console.log('Processed inquiries:', inquiriesList);
          setInquiries(inquiriesList);
        } else {
          console.log('No inquiries found in Firebase');
          setInquiries([]);
        }
      }, (error) => {
        console.error('Error loading inquiries:', error);
        // 에러 발생시 REST API로 직접 시도
        console.log('Trying direct REST API...');
        fetch('https://diora-contact-default-rtdb.firebaseio.com/inquiries.json')
          .then(res => res.json())
          .then(data => {
            if (data) {
              const inquiriesList = Object.entries(data).map(([id, inquiry]: [string, any]) => ({
                id,
                ...inquiry,
                createdAt: inquiry.createdAt ? new Date(inquiry.createdAt) : new Date()
              })).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
              console.log('REST API inquiries:', inquiriesList);
              setInquiries(inquiriesList);
            }
          })
          .catch(restError => console.error('REST API error:', restError));
      });
    } catch (error) {
      console.error('Failed to load inquiries:', error);
    }
  };

  // 문의 유형 레이블
  const getInquiryTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'partnership': '제휴/협력',
      'investment': '투자문의',
      'press': '언론/홍보',
      'general': '일반문의',
      'other': '기타'
    };
    return labels[type] || type;
  };

  // 날짜 포맷
  const formatInquiryDate = (timestamp: number | Date) => {
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return '오늘';
    } else if (days === 1) {
      return '어제';
    } else if (days < 7) {
      return `${days}일 전`;
    } else {
      return date.toLocaleDateString('ko-KR');
    }
  };

  // 상태 배지
  const getStatusBadge = (status: string) => {
    const badges: Record<string, { text: string; className: string }> = {
      'pending': { text: '대기중', className: 'status-pending' },
      'processing': { text: '처리중', className: 'status-processing' },
      'completed': { text: '완료', className: 'status-completed' }
    };
    const badge = badges[status] || { text: status, className: 'status-default' };
    return <span className={`status-badge ${badge.className}`}>{badge.text}</span>;
  };

  // 상담 메모 로드
  useEffect(() => {
    if (!selectedInquiry) {
      setConsultationNotes([{text: ''}]);
      return;
    }

    // 문의 변경 시 초기화
    setConsultationNotes([{text: ''}]);
    setIsSaving(null);

    const notesRef = ref(contactDatabase, `consultationNotes/${selectedInquiry.id}`);
    const unsubscribe = onValue(notesRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.notes && Array.isArray(data.notes)) {
        const loadedNotes = data.notes.map((note: any) => {
          if (typeof note === 'string') {
            return {text: note};
          }
          return {
            text: note.text || '',
            lastSaved: note.lastSaved ? new Date(note.lastSaved) : undefined
          };
        });
        setConsultationNotes(loadedNotes.length > 0 ? loadedNotes : [{text: ''}]);
      } else {
        setConsultationNotes([{text: ''}]);
      }
    }, (error) => {
      console.error('Error loading consultation notes:', error);
      setConsultationNotes([{text: ''}]);
    });

    return () => {
      unsubscribe();
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [selectedInquiry?.id]);

  // 상담 메모 저장 (디바운싱)
  const saveConsultationNote = async (index: number, text: string) => {
    if (!selectedInquiry) return;

    // 기존 타이머 취소
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // 빈 텍스트는 저장하지 않음
    if (!text.trim()) {
      return;
    }

    setIsSaving(index);

    // 1초 후 자동 저장
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const now = new Date();
        const updatedNotes = [...consultationNotes];
        // 현재 수정된 메모만 타임스탬프 업데이트, 다른 메모들은 기존 타임스탬프 유지
        updatedNotes[index] = {text, lastSaved: now};

        const notesRef = ref(contactDatabase, `consultationNotes/${selectedInquiry.id}`);
        const dataToSave = {
          notes: updatedNotes.map((note, i) => ({
            text: note.text || '',
            lastSaved: i === index ? now.toISOString() : (note.lastSaved ?
              (typeof note.lastSaved === 'string' ? note.lastSaved : note.lastSaved.toISOString()) : null)
          })),
          inquiryId: selectedInquiry.id,
          lastUpdated: now.toISOString()
        };

        console.log('Saving consultation notes:', dataToSave);
        await set(notesRef, dataToSave);

        // 성공적으로 저장된 경우에만 상태 업데이트
        setConsultationNotes(updatedNotes);
        setIsSaving(null);
        console.log('Consultation notes saved successfully');
      } catch (error) {
        console.error('Failed to save consultation note:', error);
        setIsSaving(null);
        alert('상담 메모 저장에 실패했습니다.');
      }
    }, 1000);
  };

  // 메모 필드 추가
  const addNoteField = () => {
    const newNotes = [...consultationNotes, {text: ''}];
    setConsultationNotes(newNotes);
  };

  // 메모 필드 삭제
  const removeNoteField = (index: number) => {
    if (consultationNotes.length === 1) return; // 최소 1개는 유지
    const newNotes = consultationNotes.filter((_, i) => i !== index);
    setConsultationNotes(newNotes);
  };

  // 메모 내용 변경
  const updateNote = (index: number, value: string) => {
    const newNotes = [...consultationNotes];
    newNotes[index] = {...newNotes[index], text: value};
    setConsultationNotes(newNotes);

    // 텍스트가 있을 때만 저장
    if (value.trim()) {
      saveConsultationNote(index, value);
    }
  };

  // 모든 채팅 불러오기 - Firebase 우선 사용
  useEffect(() => {
    // 모드가 inquiry일 때 문의 데이터 로드
    if (mode === 'inquiry') {
      console.log('Mode changed to inquiry, loading data...');
      console.log('Chat auth state:', auth.currentUser);
      console.log('Contact auth state:', contactAuth.currentUser);
      loadInquiries();
    }
  }, [mode]);

  useEffect(() => {
    // 익명 로그인 후 Firebase 리스너 설정
    const initializeAdmin = async () => {
      try {
        // 익명 로그인 (이미 로그인되어 있으면 기존 세션 사용)
        await signInAnonymously(auth);
        console.log('Admin authenticated successfully');
      } catch (error) {
        console.log('Auth error (may already be authenticated):', error);
      }

      // Firebase 리스너 (메인 데이터 소스)
      const chatsRef = ref(database, 'chats');
      const unsubscribe = onValue(chatsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const chatsList: Chat[] = Object.entries(data).map(([chatId, chatData]: [string, any]) => {
          const messages = chatData.messages ?
            Object.entries(chatData.messages).map(([msgId, msgData]: [string, any]) => ({
              id: msgId,
              ...msgData
            })).sort((a, b) => a.timestamp - b.timestamp) : [];

          return {
            id: chatId,
            info: chatData.info || {
              userId: '',
              startTime: 0,
              status: 'active' as SessionStatus,
              lastActivity: 0,
              sessionCount: 1
            },
            messages,
            statusHistory: chatData.statusHistory ?
              Object.entries(chatData.statusHistory).map(([histId, histData]: [string, any]) => ({
                id: histId,
                ...histData
              })) : []
          };
        }).sort((a, b) => (b.info.lastActivity || b.info.startTime || 0) - (a.info.lastActivity || a.info.startTime || 0));

        setChats(chatsList);

        // Firebase 데이터를 localStorage에도 백업
        chatsList.forEach(chat => {
          localStorageManager.saveChat(chat.id, chat.info, chat.messages);
        });
      } else {
        // Firebase에 데이터가 없으면 localStorage 확인
        const localChats = localStorageManager.getAllChats();
        if (localChats.length > 0) {
          setChats(localChats);
        } else {
          setChats([]);
        }
      }
    }, (error) => {
      console.error('Firebase error:', error);
      // Firebase 오류 시 localStorage 폴백
      const localChats = localStorageManager.getAllChats();
      setChats(localChats);
    });

    return () => {
      unsubscribe();
    };
    };

    initializeAdmin();
  }, []);

  // 메시지 스크롤 자동 이동
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 선택된 채팅이나 메시지가 변경될 때 스크롤
  useEffect(() => {
    if (selectedChat) {
      const selectedChatData = chats.find(chat => chat.id === selectedChat);
      if (selectedChatData) {
        // 약간의 지연을 주어 DOM이 업데이트된 후 스크롤
        setTimeout(scrollToBottom, 100);
      }
    }
  }, [selectedChat, chats]);

  // 드롭다운 외부 클릭시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown && !(event.target as Element).closest('.chat-options-menu')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  // 상태별 채팅 그룹화
  const groupedChats = useMemo((): Record<TabType, Chat[]> => {
    const groups = {
      all: chats,
      active: chats.filter(chat => chat.info.status === 'active'),
      inactive: chats.filter(chat => chat.info.status === 'inactive'),
      closed: chats.filter(chat => chat.info.status === 'closed'),
      reopened: chats.filter(chat => chat.info.status === 'reopened'),
      archived: chats.filter(chat => chat.info.archived === true),
      blocked: chats.filter(chat => chat.info.blockedUser === true)
    };
    return groups;
  }, [chats]);

  // 현재 탭의 채팅 목록
  const currentChats = groupedChats[activeTab];

  // 채팅 보관
  const handleArchiveChat = async (chatId: string) => {
    try {
      await update(ref(database, `chats/${chatId}/info`), {
        archived: true,
        archivedAt: Date.now()
      });
      showToast('채팅이 보관되었습니다');
    } catch (error) {
      console.error('보관 실패:', error);
      showToast('보관에 실패했습니다');
    }
  };

  // 채팅 보관 해제
  const handleUnarchiveChat = async (chatId: string) => {
    try {
      await update(ref(database, `chats/${chatId}/info`), {
        archived: false,
        archivedAt: null
      });
      showToast('보관이 해제되었습니다');
    } catch (error) {
      console.error('보관 해제 실패:', error);
      showToast('보관 해제에 실패했습니다');
    }
  };

  // 사용자 차단
  const handleBlockChat = async (chatId: string) => {
    try {
      await update(ref(database, `chats/${chatId}/info`), {
        blockedUser: true,
        blockedAt: Date.now(),
        status: 'closed'
      });
      showToast('사용자가 차단되었습니다');
    } catch (error) {
      console.error('차단 실패:', error);
      showToast('차단에 실패했습니다');
    }
  };

  // 사용자 차단 해제
  const handleUnblockChat = async (chatId: string) => {
    try {
      await update(ref(database, `chats/${chatId}/info`), {
        blockedUser: false,
        blockedAt: null
      });
      showToast('차단이 해제되었습니다');
    } catch (error) {
      console.error('차단 해제 실패:', error);
      showToast('차단 해제에 실패했습니다');
    }
  };

  // 채팅 삭제
  const handleDeleteChat = async (chatId: string) => {
    if (!window.confirm('정말로 이 채팅을 삭제하시겠습니까?')) return;

    try {
      await update(ref(database), { [`chats/${chatId}`]: null });
      showToast('채팅이 삭제되었습니다');
      if (selectedChat === chatId) {
        setSelectedChat(null);
      }
    } catch (error) {
      console.error('삭제 실패:', error);
      showToast('삭제에 실패했습니다');
    }
  };

  // 채팅 거부 처리 (영구 차단)
  const handleRejectChat = async (chatId: string) => {
    if (!window.confirm('이 사용자를 영구적으로 차단하시겠습니까?')) return;

    try {
      await update(ref(database, `chats/${chatId}/info`), {
        rejected: true,
        rejectedAt: Date.now(),
        status: 'closed',
        blockedUser: true
      });
      showToast('사용자가 거부 처리되었습니다');
    } catch (error) {
      console.error('거부 처리 실패:', error);
      showToast('거부 처리에 실패했습니다');
    }
  };

  // 관리자 답장 전송
  const sendReply = async () => {
    if (!replyText.trim() || !selectedChat) return;

    const messageData = {
      text: replyText,
      sender: 'admin',
      timestamp: Date.now()
    };

    try {
      // Firebase에 메시지 전송 (자동으로 리스너가 받아서 UI 업데이트)
      await push(ref(database, `chats/${selectedChat}/messages`), messageData);

      // 텔레그램으로 관리자 답변 알림 전송
      await sendAdminReplyNotification(selectedChat, replyText);

      setReplyText('');
    } catch (error) {
      console.error('답장 전송 실패:', error);
      // 실패 시 localStorage에라도 저장
      const fallbackMessage: Message = {
        id: `admin_${Date.now()}`,
        text: messageData.text,
        sender: 'admin' as const,
        timestamp: messageData.timestamp
      };
      localStorageManager.addMessage(selectedChat, fallbackMessage);
    }
  };

  // 관리자가 채팅 종료
  const handleCloseChat = async (chatId: string) => {
    try {
      const updates = {
        [`chats/${chatId}/info/status`]: 'closed',
        [`chats/${chatId}/info/endTime`]: Date.now(),
        [`chats/${chatId}/info/closedBy`]: 'admin',
        [`chats/${chatId}/info/closeReason`]: 'admin_close'
      };

      await update(ref(database), updates);
      await sendSessionNotification('closed', 'admin_close', chatId);

      // 시스템 메시지 추가
      const systemMessage = {
        text: '관리자가 대화를 종료했습니다.',
        sender: 'system',
        timestamp: Date.now(),
        type: 'system_notification'
      };
      await push(ref(database, `chats/${chatId}/messages`), systemMessage);
    } catch (error) {
      console.error('채팅 종료 실패:', error);
    }
  };

  const selectedChatData = chats.find(chat => chat.id === selectedChat);

  // 탭별 드롭다운 버튼 구성
  const getDropdownButtons = (activeTab: TabType, chat: Chat) => {
    if (activeTab === 'archived') {
      return [
        { action: 'unarchive', icon: '📤', label: '보관해제' },
        { action: 'delete', icon: '🗑️', label: '삭제' },
        { action: 'block', icon: '🚫', label: '차단' }
      ];
    } else if (activeTab === 'blocked') {
      return [
        { action: 'unblock', icon: '✅', label: '차단해제' },
        { action: 'delete', icon: '🗑️', label: '삭제' },
        { action: 'reject', icon: '❌', label: '거부' }
      ];
    } else {
      return [
        { action: 'archive', icon: '📁', label: '보관' },
        { action: 'delete', icon: '🗑️', label: '삭제' },
        { action: 'block', icon: '🚫', label: '차단' }
      ];
    }
  };

  // 드롭다운 액션 실행
  const handleDropdownAction = (action: string, chatId: string) => {
    setOpenDropdown(null); // 드롭다운 닫기

    switch (action) {
      case 'archive':
        handleArchiveChat(chatId);
        break;
      case 'unarchive':
        handleUnarchiveChat(chatId);
        break;
      case 'block':
        handleBlockChat(chatId);
        break;
      case 'unblock':
        handleUnblockChat(chatId);
        break;
      case 'delete':
        handleDeleteChat(chatId);
        break;
      case 'reject':
        handleRejectChat(chatId);
        break;
    }
  };

  // 상태별 아이콘과 색상
  const getStatusIcon = (status: SessionStatus) => {
    switch (status) {
      case 'active': return '🟢';
      case 'inactive': return '🟡';
      case 'closed': return '🔴';
      case 'reopened': return '🟠';
      default: return '⚪';
    }
  };

  const formatTime = (timestamp: number) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return '어제 ' + date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    } else if (days < 7) {
      return `${days}일 전`;
    } else {
      return date.toLocaleDateString('ko-KR');
    }
  };

  return (
    <div className="admin-container">
      {/* Toast 알림 */}
      {toastMessage && (
        <div className="toast-notification">
          {toastMessage}
        </div>
      )}

      <div className="admin-header">
        <h1>
          <a href="https://diora.co.kr" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
            DIORA
          </a>
          {' '}채팅 관리
          <div className="mode-toggle">
            <button className={`mode-btn ${mode === 'chat' ? 'active' : ''}`} onClick={() => setMode('chat')}>채팅</button>
            <button className={`mode-btn ${mode === 'inquiry' ? 'active' : ''}`} onClick={() => setMode('inquiry')}>문의</button>
          </div>
        </h1>

        {/* 탭 네비게이션 - 헤더 내부로 이동 */}
        <div className="admin-tabs" style={{ display: mode === 'chat' ? 'block' : 'none' }}>
          <div className="admin-tab-list">
            <button
              className={`admin-tab-button ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              전체
              <span className="admin-tab-badge">{groupedChats.all.length}</span>
            </button>
            <button
              className={`admin-tab-button ${activeTab === 'active' ? 'active' : ''}`}
              onClick={() => setActiveTab('active')}
            >
              활성
              <span className="admin-tab-badge">{groupedChats.active.length}</span>
            </button>
            <button
              className={`admin-tab-button ${activeTab === 'inactive' ? 'active' : ''}`}
              onClick={() => setActiveTab('inactive')}
            >
              비활성
              <span className="admin-tab-badge">{groupedChats.inactive.length}</span>
            </button>
            <button
              className={`admin-tab-button ${activeTab === 'closed' ? 'active' : ''}`}
              onClick={() => setActiveTab('closed')}
            >
              종료
              <span className="admin-tab-badge">{groupedChats.closed.length}</span>
            </button>
            <button
              className={`admin-tab-button ${activeTab === 'reopened' ? 'active' : ''}`}
              onClick={() => setActiveTab('reopened')}
            >
              재개
              <span className="admin-tab-badge">{groupedChats.reopened.length}</span>
            </button>
            <button
              className={`admin-tab-button ${activeTab === 'archived' ? 'active' : ''}`}
              onClick={() => setActiveTab('archived')}
            >
              보관
              <span className="admin-tab-badge">{groupedChats.archived.length}</span>
            </button>
            <button
              className={`admin-tab-button ${activeTab === 'blocked' ? 'active' : ''}`}
              onClick={() => setActiveTab('blocked')}
            >
              차단
              <span className="admin-tab-badge">{groupedChats.blocked.length}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="admin-layout">
        {mode === 'inquiry' ? (
          /* 문의 모드 */
          <>
            {/* 문의 목록 */}
            <div className="chat-list">
              <div className="chat-list-header">
                <h3>모든 문의</h3>
                <span className="chat-count">{inquiries.length}개</span>
              </div>
              <div id="inquiryListContent">
                {inquiries.length === 0 ? (
                  <div className="no-chats">
                    <p>문의가 없습니다</p>
                  </div>
                ) : (
                  inquiries.map(inquiry => (
                    <div
                      key={inquiry.id}
                      className={`inquiry-item ${inquiry.unread ? 'unread' : ''} ${selectedInquiry?.id === inquiry.id ? 'active' : ''}`}
                      onClick={() => setSelectedInquiry(inquiry)}
                    >
                      <div className="inquiry-header">
                        <div className="inquiry-company">{inquiry.company}</div>
                        <div className="inquiry-date">{formatInquiryDate(inquiry.createdAt)}</div>
                      </div>
                      <div className="inquiry-meta">
                        <div className="inquiry-name">{inquiry.name}</div>
                        <div className="inquiry-type">{getInquiryTypeLabel(inquiry.inquiryType)}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 문의 상세 */}
            <div className="chat-detail">
              {selectedInquiry ? (
                <div id="inquiryDetailContent">
                  <div className="detail-header">
                    <div className="detail-company">{selectedInquiry.company}</div>
                    <div className="detail-meta">
                      <span>담당자: {selectedInquiry.name}</span>
                      <span>접수일: {new Date(selectedInquiry.createdAt).toLocaleString('ko-KR')}</span>
                    </div>
                  </div>

                  <div className="detail-grid" style={{gridTemplateColumns: '1fr 1fr 1fr'}}>
                    <div className="detail-field">
                      <div className="field-label">담당자</div>
                      <div className="field-value">{selectedInquiry.name}</div>
                    </div>
                    <div className="detail-field">
                      <div className="field-label">이메일</div>
                      <div className="field-value">{selectedInquiry.email}</div>
                    </div>
                    <div className="detail-field">
                      <div className="field-label">연락처</div>
                      <div className="field-value">{selectedInquiry.phone}</div>
                    </div>
                    <div className="detail-field full-width">
                      <div className="field-label">문의 내용</div>
                      <div className="field-value">{selectedInquiry.content}</div>
                    </div>
                    {selectedInquiry.additionalRequest && (
                      <div className="detail-field full-width">
                        <div className="field-label">추가 요청사항</div>
                        <div className="field-value">{selectedInquiry.additionalRequest}</div>
                      </div>
                    )}

                    {/* 상담 메모 섹션 */}
                    <div className="detail-field full-width">
                      <div className="field-label">상담 메모</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {consultationNotes.map((note, index) => (
                          <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                            <div style={{
                              minWidth: '180px',
                              fontSize: '12px',
                              color: isSaving === index ? '#f59e0b' : '#6b7280',
                              paddingTop: '14px'
                            }}>
                              {isSaving === index ? '저장 중...' :
                               note.lastSaved ? (() => {
                                 const date = new Date(note.lastSaved);
                                 const year = String(date.getFullYear()).slice(2);
                                 const month = String(date.getMonth() + 1).padStart(2, '0');
                                 const day = String(date.getDate()).padStart(2, '0');
                                 const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
                                 const dayName = dayNames[date.getDay()];
                                 const hours = String(date.getHours()).padStart(2, '0');
                                 const minutes = String(date.getMinutes()).padStart(2, '0');
                                 const seconds = String(date.getSeconds()).padStart(2, '0');
                                 return `${year}.${month}.${day}(${dayName}) ${hours}:${minutes}:${seconds}`;
                               })() : '저장 전'}
                            </div>
                            <textarea
                              value={note.text}
                              onChange={(e) => updateNote(index, e.target.value)}
                              placeholder="상담 내용을 입력하세요..."
                              style={{
                                flex: 1,
                                minHeight: '80px',
                                padding: '12px',
                                fontSize: '14px',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                backgroundColor: '#f9fafb',
                                resize: 'vertical',
                                fontFamily: 'inherit',
                                lineHeight: '1.5'
                              }}
                            />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <button
                                onClick={addNoteField}
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  padding: '0',
                                  fontSize: '18px',
                                  fontWeight: 'bold',
                                  color: '#10b981',
                                  backgroundColor: '#d1fae5',
                                  border: '1px solid #10b981',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = '#10b981';
                                  e.currentTarget.style.color = 'white';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = '#d1fae5';
                                  e.currentTarget.style.color = '#10b981';
                                }}
                              >
                                +
                              </button>
                              {consultationNotes.length > 1 && (
                                <button
                                  onClick={() => removeNoteField(index)}
                                  style={{
                                    width: '32px',
                                    height: '32px',
                                    padding: '0',
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    color: '#ef4444',
                                    backgroundColor: '#fee2e2',
                                    border: '1px solid #ef4444',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#ef4444';
                                    e.currentTarget.style.color = 'white';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#fee2e2';
                                    e.currentTarget.style.color = '#ef4444';
                                  }}
                                >
                                  −
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="no-selection" id="inquiryNoSelection">
                  <p>문의를 선택해주세요</p>
                </div>
              )}
            </div>
          </>
        ) : (
          /* 채팅 모드 */
          <>
            {/* 채팅 목록 */}
            <div className="chat-list">
          <div className="chat-list-header">
            <h3>{activeTab === 'all' ? '모든 대화' :
                activeTab === 'active' ? '진행 중인 대화' :
                activeTab === 'inactive' ? '비활성 대화' :
                activeTab === 'closed' ? '종료된 대화' :
                activeTab === 'reopened' ? '재개된 대화' :
                activeTab === 'archived' ? '보관된 대화' : '차단된 사용자'}</h3>
            <span className="chat-count">{currentChats.length}개</span>
          </div>

          {currentChats.length === 0 ? (
            <div className="no-chats">
              <p>표시할 대화가 없습니다</p>
            </div>
          ) : (
            currentChats.map(chat => (
              <div key={chat.id} className="chat-item-wrapper">
                <div
                  className={`chat-item ${selectedChat === chat.id ? 'active' : ''}`}
                  onClick={() => setSelectedChat(chat.id)}
                >
                  <div className="chat-item-header">
                    <div className="chat-item-id">
                      {getStatusIcon(chat.info.status)}
                      <strong>채팅 #{chat.id.slice(-8)}</strong>
                    </div>
                    <span className="chat-item-time">
                      {formatTime(chat.info.lastActivity || chat.info.startTime)}
                    </span>
                  </div>

                  <div className="chat-item-content">
                    <div className="last-message-preview">
                      {chat.messages.length > 0 ?
                        `${chat.messages[chat.messages.length - 1].sender === 'customer' ? '고객' :
                          chat.messages[chat.messages.length - 1].sender === 'admin' ? '관리자' : '시스템'}:\u00A0${chat.messages[chat.messages.length - 1].text}` :
                        '메시지 없음'
                      }
                    </div>
                  </div>
                </div>

                <div className="chat-options-menu">
                  <button
                    className="options-trigger"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdown(openDropdown === chat.id ? null : chat.id);
                    }}
                    title="옵션"
                  >
                    ⋯
                  </button>
                  {openDropdown === chat.id && (
                    <div className="options-dropdown">
                      {getDropdownButtons(activeTab, chat).map((button) => (
                        <button
                          key={button.action}
                          className={`dropdown-action ${button.action}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDropdownAction(button.action, chat.id);
                          }}
                        >
                          <span>{button.icon}</span>
                          <span>{button.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* 선택된 채팅 상세 */}
        {selectedChatData ? (
          <div className="chat-detail">
            <div className="chat-detail-header">
              <div className="chat-detail-left">
                <h3>채팅 #{selectedChat?.slice(-8)}</h3>
                <span className={`status-badge large ${selectedChatData.info.status}`}>
                  {getStatusIcon(selectedChatData.info.status)}
                  {selectedChatData.info.status === 'active' ? '활성' :
                   selectedChatData.info.status === 'inactive' ? '비활성' :
                   selectedChatData.info.status === 'closed' ? '종료됨' : '재개됨'}
                </span>
              </div>

              <div className="chat-detail-center">
                <div className="header-meta-item">
                  <span className="meta-label">시작:</span>
                  <span className="meta-value">
                    {selectedChatData.info.startTime ?
                      formatTime(selectedChatData.info.startTime) : '-'}
                  </span>
                </div>
                <div className="header-meta-item">
                  <span className="meta-label">마지막:</span>
                  <span className="meta-value">
                    {selectedChatData.info.lastActivity ?
                      formatTime(selectedChatData.info.lastActivity) : '-'}
                  </span>
                </div>
              </div>

              <div className="chat-detail-right">
                {selectedChatData.info.status === 'active' && (
                  <button
                    className="btn-close-chat"
                    onClick={() => handleCloseChat(selectedChatData.id)}
                  >
                    대화 종료
                  </button>
                )}
              </div>
            </div>

            <div className="messages">
              {selectedChatData.messages.map(message => (
                <div
                  key={message.id}
                  className={`message ${message.sender}`}
                >
                  <div className="message-bubble">
                    {message.text}
                  </div>
                  <div className="message-time">
                    {message.timestamp ?
                      new Date(message.timestamp).toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : ''}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {selectedChatData.info.status !== 'closed' && (
              <div className="reply-section">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendReply();
                    }
                  }}
                  placeholder="관리자 답장을 입력하세요..."
                  rows={3}
                />
                <button
                  onClick={sendReply}
                  disabled={!replyText.trim()}
                >
                  답장 전송
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="no-selection">
            <p>채팅을 선택해주세요</p>
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPage;