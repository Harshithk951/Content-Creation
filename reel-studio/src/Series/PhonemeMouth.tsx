import React from "react";

export type VisemeType =
  | "REST"
  | "CLOSED_MBP"
  | "TEETH_FV"
  | "VOWEL_OPEN"
  | "VOWEL_ROUND"
  | "TALK_MID";

interface PhonemeMouthProps {
  character: "boy" | "claude";
  viseme: VisemeType;
  jaw: number; // 0.0 to 1.0 jaw displacement
  scale?: number;
}

export const PhonemeMouth: React.FC<PhonemeMouthProps> = ({
  character,
  viseme,
  jaw,
  scale = 1.0,
}) => {
  if (viseme === "REST") {
    return null;
  }

  const jawOffset = jaw * 5; // Pixels to move jaw downwards on vowel articulation

  if (character === "boy") {
    // Stylized boy mouth matching low-poly warm render aesthetic
    return (
      <div
        style={{
          width: 84 * scale,
          height: 60 * scale,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateY(${jawOffset}px) scale(${scale})`,
          transition: "transform 0.04s ease-out",
          pointerEvents: "none",
        }}
      >
        <svg
          width="84"
          height="60"
          viewBox="0 0 84 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle skin blending backing to avoid double-mouth seams */}
          <ellipse
            cx="42"
            cy="30"
            rx="38"
            ry="24"
            fill="#D59372"
            opacity="0.95"
          />

          {viseme === "CLOSED_MBP" && (
            // Lips pressed together for M, B, P
            <g>
              <path
                d="M16 30 C28 32, 56 32, 68 30"
                stroke="#682A1B"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M24 34 C34 37, 50 37, 60 34"
                stroke="#BA6654"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.8"
              />
            </g>
          )}

          {viseme === "TEETH_FV" && (
            // Top teeth resting on bottom lip for F, V
            <g>
              {/* Dark inner shadow */}
              <ellipse cx="42" cy="30" rx="22" ry="10" fill="#2E130D" />
              {/* White teeth row touching bottom lip */}
              <path
                d="M26 26 Q42 27 58 26 L56 32 Q42 34 28 32 Z"
                fill="#FDFBFA"
              />
              {/* Lower lip line */}
              <path
                d="M20 33 C32 37, 52 37, 64 33"
                stroke="#A85747"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </g>
          )}

          {viseme === "VOWEL_OPEN" && (
            // Wide open jaw for A, E, I vowels
            <g>
              {/* Deep oral cavity */}
              <path
                d="M20 22 C20 18, 64 18, 64 22 C64 42, 20 42, 20 22 Z"
                fill="#220D08"
              />
              {/* Top teeth */}
              <path
                d="M27 20 Q42 21 57 20 L55 24 Q42 25 29 24 Z"
                fill="#FDFBFA"
              />
              {/* Tongue in cavity bottom */}
              <path
                d="M32 36 Q42 32 52 36 Q42 41 32 36 Z"
                fill="#C45A54"
              />
              {/* Soft lip contour */}
              <path
                d="M18 22 C18 44, 66 44, 66 22"
                stroke="#944537"
                strokeWidth="2"
                fill="none"
              />
            </g>
          )}

          {viseme === "VOWEL_ROUND" && (
            // Rounded "O" / "U" mouth
            <g>
              <ellipse cx="42" cy="30" rx="15" ry="17" fill="#220D08" />
              <ellipse
                cx="42"
                cy="30"
                rx="15"
                ry="17"
                stroke="#944537"
                strokeWidth="2.5"
                fill="none"
              />
              {/* Small top teeth glimpse */}
              <path
                d="M34 22 Q42 23 50 22 L49 24 Q42 25 35 24 Z"
                fill="#FDFBFA"
                opacity="0.85"
              />
            </g>
          )}

          {viseme === "TALK_MID" && (
            // Medium relaxed consonant/transit mouth
            <g>
              <ellipse cx="42" cy="30" rx="24" ry="11" fill="#240E09" />
              {/* Teeth band */}
              <path
                d="M26 26 Q42 27 58 26 L56 29 Q42 30 28 29 Z"
                fill="#FDFBFA"
              />
              <path
                d="M18 30 C30 38, 54 38, 66 30"
                stroke="#944537"
                strokeWidth="2.5"
                fill="none"
              />
            </g>
          )}
        </svg>
      </div>
    );
  }

  // Claude terracotta character
  return (
    <div
      style={{
        width: 76 * scale,
        height: 54 * scale,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `translateY(${jawOffset * 0.7}px) scale(${scale})`,
        transition: "transform 0.04s ease-out",
        pointerEvents: "none",
      }}
    >
      <svg
        width="76"
        height="54"
        viewBox="0 0 76 54"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Skin blend backing for Claude */}
        <ellipse
          cx="38"
          cy="27"
          rx="34"
          ry="20"
          fill="#D66632"
          opacity="0.95"
        />

        {viseme === "CLOSED_MBP" && (
          // Claude bilabial pressed lips
          <path
            d="M16 27 C28 29, 48 29, 60 27"
            stroke="#421406"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        )}

        {viseme === "TEETH_FV" && (
          // Claude F/V teeth
          <g>
            <ellipse cx="38" cy="27" rx="18" ry="8" fill="#2B0E05" />
            <path
              d="M24 24 Q38 25 52 24 L50 28 Q38 29 26 28 Z"
              fill="#F9F5F0"
            />
            <path
              d="M18 29 C28 33, 48 33, 58 29"
              stroke="#68220A"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
        )}

        {viseme === "VOWEL_OPEN" && (
          // Claude open vowel
          <g>
            <path
              d="M18 20 C18 16, 58 16, 58 20 C58 38, 18 38, 18 20 Z"
              fill="#240B04"
            />
            {/* Top little teeth */}
            <path
              d="M24 18 Q38 19 52 18 L50 21 Q38 22 26 21 Z"
              fill="#F9F5F0"
            />
            {/* Tongue */}
            <ellipse cx="38" cy="33" rx="10" ry="4" fill="#C2543A" />
          </g>
        )}

        {viseme === "VOWEL_ROUND" && (
          // Claude round "O"
          <g>
            <ellipse cx="38" cy="27" rx="13" ry="14" fill="#240B04" />
            <ellipse
              cx="38"
              cy="27"
              rx="13"
              ry="14"
              stroke="#68220A"
              strokeWidth="2"
              fill="none"
            />
          </g>
        )}

        {viseme === "TALK_MID" && (
          // Claude mid speech
          <g>
            <ellipse cx="38" cy="27" rx="20" ry="9" fill="#240B04" />
            <path
              d="M22 24 Q38 25 54 24 L52 27 Q38 28 24 27 Z"
              fill="#F9F5F0"
              opacity="0.9"
            />
            <path
              d="M16 28 C28 34, 48 34, 60 28"
              stroke="#68220A"
              strokeWidth="2"
              fill="none"
            />
          </g>
        )}
      </svg>
    </div>
  );
};
