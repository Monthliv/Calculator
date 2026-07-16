/**
 * MONTHLIV 환불 예정 금액 계산기 - 팝업 임베드 스크립트
 *
 * 사용법:
 * 1. 이 파일을 호스팅(GitHub Pages 등)에 함께 올리거나, 본인 웹사이트 서버에 둡니다.
 * 2. 계산기를 띄우고 싶은 페이지에 아래 두 줄을 추가합니다.
 *
 *    <script src="embed.js"></script>
 *    <button data-refund-calc-trigger>환불 예정 금액 계산기</button>
 *
 * 3. 아래 CALCULATOR_URL을 실제 배포된 계산기 주소로 바꿔주세요.
 *    (예: https://your-id.github.io/monthliv-refund-calculator/)
 */
(function () {
  // ---- 이 값만 배포 후 실제 주소로 교체하면 됩니다 ----
  const CALCULATOR_URL = 'https://monthliv.github.io/Calculator/';

  let modalEl = null;

  function injectStyles() {
    if (document.getElementById('refund-calc-style')) return;
    const style = document.createElement('style');
    style.id = 'refund-calc-style';
    style.textContent = `
      .rfc-overlay{
        position:fixed; inset:0; background:rgba(20,20,15,0.45);
        display:flex; align-items:center; justify-content:center;
        z-index:999999; opacity:0; transition:opacity .18s ease;
        padding:16px;
      }
      .rfc-overlay.rfc-open{ opacity:1; }
      .rfc-modal{
        background:#fff; width:100%; max-width:480px; height:min(720px, 92vh);
        border-radius:18px; overflow:hidden; box-shadow:0 20px 60px rgba(0,0,0,0.25);
        display:flex; flex-direction:column;
        transform:translateY(12px); transition:transform .18s ease;
      }
      .rfc-overlay.rfc-open .rfc-modal{ transform:translateY(0); }
      .rfc-header{
        display:flex; align-items:center; justify-content:flex-end;
        padding:8px 8px 0;
      }
      .rfc-close{
        appearance:none; border:none; background:#F0EEE8; color:#333;
        width:32px; height:32px; border-radius:50%; font-size:16px;
        cursor:pointer; line-height:1;
      }
      .rfc-iframe{ flex:1; width:100%; border:none; }

      /* 모바일: 풀스크린 바텀시트 형태 */
      @media (max-width: 560px){
        .rfc-overlay{ padding:0; align-items:flex-end; }
        .rfc-modal{
          max-width:100%; width:100%; height:94vh; border-radius:18px 18px 0 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function openModal() {
    injectStyles();
    if (modalEl) { modalEl.classList.add('rfc-open'); document.body.style.overflow = 'hidden'; return; }

    modalEl = document.createElement('div');
    modalEl.className = 'rfc-overlay';
    modalEl.innerHTML = `
      <div class="rfc-modal" role="dialog" aria-modal="true" aria-label="환불 예정 금액 계산기">
        <div class="rfc-header">
          <button type="button" class="rfc-close" aria-label="닫기">✕</button>
        </div>
        <iframe class="rfc-iframe" src="${CALCULATOR_URL}" title="환불 예정 금액 계산기"></iframe>
      </div>
    `;
    document.body.appendChild(modalEl);
    document.body.style.overflow = 'hidden';

    // 다음 프레임에 open 클래스를 붙여야 트랜지션이 자연스럽게 재생됩니다
    requestAnimationFrame(() => modalEl.classList.add('rfc-open'));

    modalEl.querySelector('.rfc-close').addEventListener('click', closeModal);
    modalEl.addEventListener('click', (e) => { if (e.target === modalEl) closeModal(); });
  }

  function closeModal() {
    if (!modalEl) return;
    modalEl.classList.remove('rfc-open');
    document.body.style.overflow = '';
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // data-refund-calc-trigger 속성이 붙은 모든 요소 클릭 시 팝업 오픈
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-refund-calc-trigger]');
    if (trigger) {
      e.preventDefault();
      openModal();
    }
  });

  // 필요하면 코드에서 직접 호출할 수 있도록 전역 함수도 노출
  window.openRefundCalculator = openModal;
  window.closeRefundCalculator = closeModal;
})();
