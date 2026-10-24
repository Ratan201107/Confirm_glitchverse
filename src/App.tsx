/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';

export default function App() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioStarted, setAudioStarted] = useState(false);

  useEffect(() => {
    // Forward keyboard events from parent window to iframe so game controls never drop
    const handleKeyDown = (e: KeyboardEvent) => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        // Only forward if activeElement is not an input inside parent
        const activeTag = document.activeElement?.tagName.toLowerCase();
        if (activeTag !== 'input' && activeTag !== 'textarea') {
          try {
            iframeRef.current.contentWindow.dispatchEvent(
              new KeyboardEvent('keydown', {
                key: e.key,
                code: e.code,
                keyCode: e.keyCode,
                which: e.which,
                bubbles: true,
                cancelable: true,
                repeat: e.repeat,
              })
            );
          } catch {
            // Ignore cross-origin error if any
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        try {
          iframeRef.current.contentWindow.dispatchEvent(
            new KeyboardEvent('keyup', {
              key: e.key,
              code: e.code,
              keyCode: e.keyCode,
              which: e.which,
              bubbles: true,
              cancelable: true,
            })
          );
        } catch {
          // Ignore
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleContainerClick = () => {
    if (!audioStarted) {
      setAudioStarted(true);
    }
    // Give focus to iframe so space/arrow keys work directly
    if (iframeRef.current) {
      iframeRef.current.focus();
    }
  };

  return (
    <div 
      className="relative w-screen h-screen overflow-hidden bg-black select-none flex flex-col"
      onClick={handleContainerClick}
    >
      {/* Game Frame */}
      <iframe
        ref={iframeRef}
        src="/assets/aistudio/GAME_FINAL_44f8a7a2.HTML"
        title="GLITCHPULSE: The Final Platform · Rhythm Dash"
        className="w-full h-full border-0 block select-none bg-black"
        allow="autoplay; audio-capture"
        tabIndex={0}
      />

      {/* Floating Fullscreen Utility Toggle */}
      <div className="fixed bottom-3 right-3 z-50 pointer-events-auto flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFullscreen();
          }}
          className="px-2.5 py-1.5 bg-zinc-950/80 hover:bg-zinc-900 border border-cyan-500/30 hover:border-cyan-400 rounded text-[11px] font-mono text-cyan-300 font-bold tracking-wider shadow-lg cursor-pointer transition-all active:scale-95"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? '⤢ WINDOW' : '⤡ FULLSCREEN'}
        </button>
      </div>
    </div>
  );
}
