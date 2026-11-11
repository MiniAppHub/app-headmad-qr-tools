/**
 * Клиентский SDK MiniAppHub (в стиле Telegram Bot API: { ok, result }).
 * Общается с оболочкой через window.parent.postMessage.
 * @module sdk
 */

/**
 * @typedef {{ ok: true, result: any } | { ok: false, error: string }} ApiResponse
 */

export class MiniApp {
  constructor() {
    this._seq = 0;
    this._pending = new Map();
    window.addEventListener('message', (e) => {
      const msg = e.data;
      if (!msg || msg.source !== 'appshell' || msg.id == null) return;
      const cb = this._pending.get(msg.id);
      if (cb) {
        this._pending.delete(msg.id);
        cb(msg.response);
      }
    });
  }

  /**
   * Вызов метода оболочки, например `system.info` или `ui.theme`.
   * @param {string} method
   * @param {Object} [params]
   * @param {number} [timeoutMs=5000]
   * @returns {Promise<ApiResponse>}
   */
  call(method, params = {}, timeoutMs = 5000) {
    const id = ++this._seq;
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        this._pending.delete(id);
        resolve({ ok: false, error: 'timeout' });
      }, timeoutMs);
      this._pending.set(id, (resp) => { clearTimeout(timer); resolve(resp); });
      window.parent.postMessage({ source: 'miniapp', id, method, params }, '*');
    });
  }
}
