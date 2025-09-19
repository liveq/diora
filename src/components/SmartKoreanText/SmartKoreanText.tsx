import React from 'react';
import './SmartKoreanText.css';

interface SmartKoreanTextProps {
  text: string;
  className?: string;
  preserveSpaces?: boolean;  // Non-breaking space 유지 여부
}

const SmartKoreanText: React.FC<SmartKoreanTextProps> = ({
  text,
  className = '',
  preserveSpaces = false
}) => {
  // 한국어 단어 분리 로직 - 공백을 보존하면서 의미 단위로 분리
  const parseKoreanText = (inputText: string): string[] => {
    // Non-breaking space를 일반 공백으로 변환 (옵션)
    let processedText = preserveSpaces ? inputText : inputText.replace(/\u00A0/g, ' ');

    // 조사 목록 (뒤에 붙는 것들)
    const particles = [
      '은', '는', '이', '가', '을', '를', '에', '에서', '에게', '한테',
      '와', '과', '로', '으로', '의', '도', '만', '까지', '부터', '처럼',
      '보다', '라고', '이라고', '고', '며', '나', '이나', '든지', '라도',
      '이라도', '하고', '에게서', '로부터', '으로부터', '까지도', '마저',
      '조차', '밖에', '뿐', '대로', '만큼', '하여', '으로써', '함으로써'
    ];

    // 세그먼트 내에서 조사를 기준으로 분리하는 헬퍼 함수
    const parseSegmentWithParticles = (segment: string): string[] => {
      const words: string[] = [];
      let currentWord = '';
      const chars = segment.split('');

      for (let i = 0; i < chars.length; i++) {
        const char = chars[i];
        currentWord += char;

        // 다음 문자들 확인
        const nextChar = chars[i + 1];
        const nextTwoChars = chars.slice(i + 1, i + 3).join('');
        const nextThreeChars = chars.slice(i + 1, i + 4).join('');

        // 조사 체크 (현재 단어가 충분히 길고, 다음이 조사인 경우)
        if (currentWord.length >= 2 && nextChar) {
          let foundParticle = false;
          let particleLength = 0;

          // 긴 조사부터 체크 (우선순위)
          for (const particle of particles) {
            if (particle.length === 3 && nextThreeChars === particle) {
              foundParticle = true;
              particleLength = 3;
              break;
            } else if (particle.length === 2 && nextTwoChars === particle) {
              foundParticle = true;
              particleLength = 2;
              break;
            } else if (particle.length === 1 && nextChar === particle) {
              foundParticle = true;
              particleLength = 1;
              break;
            }
          }

          // 조사 발견 시 조사를 포함한 단어 단위로 분리
          if (foundParticle && currentWord.length >= 2) {
            const isKorean = /[가-힣]/.test(currentWord);
            if (isKorean) {
              // 조사까지 포함한 전체 단어 단위 생성
              const wordWithParticle = currentWord + chars.slice(i + 1, i + 1 + particleLength).join('');
              words.push(wordWithParticle);
              // 조사 부분 건너뛰기
              i += particleLength;
              currentWord = '';
              continue;
            }
          }
        }

        // 문장부호에서 분리
        if (/[.,!?;:]/.test(char)) {
          if (currentWord) {
            words.push(currentWord);
            currentWord = '';
          }
        }
      }

      // 마지막 단어 추가
      if (currentWord) {
        words.push(currentWord);
      }

      return words;
    };

    // 공백으로 먼저 분리하여 자연스러운 단어 경계 유지
    const spaceSegments = processedText.split(' ');
    const words: string[] = [];

    for (let segmentIndex = 0; segmentIndex < spaceSegments.length; segmentIndex++) {
      const segment = spaceSegments[segmentIndex];

      if (!segment) {
        // 빈 문자열(연속된 공백)인 경우 공백을 별도 요소로 추가
        words.push(' ');
        continue;
      }

      // 각 세그먼트 내에서 조사 기준으로 세분화
      const subWords = parseSegmentWithParticles(segment);

      // 첫 번째 세그먼트가 아닌 경우 앞에 공백 추가
      if (segmentIndex > 0 && subWords.length > 0) {
        words.push(' ');
      }

      words.push(...subWords);
    }

    return words.filter(word => word.length > 0);
  };

  const words = parseKoreanText(text);

  return (
    <span className={`smart-korean-text ${className}`}>
      {words.map((word, index) => (
        <span key={index} className={word === ' ' ? 'space-unit' : 'word-unit'}>
          {word}
        </span>
      ))}
    </span>
  );
};

export default SmartKoreanText;