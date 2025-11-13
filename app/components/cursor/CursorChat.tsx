import CursorSVG from "@/public/assets/CursorSVG";
import { CursorChatProps, CursorMode } from "@/types/type";

const CursorChat = ({
  cursor,
  cursorState,
  setCursorState,
  updateMyPresence,
}: CursorChatProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateMyPresence({ message: e.target.value });
    setCursorState({
      mode: CursorMode.Chat,
      previousMessage: null,
      message: e.target.value,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (cursorState.mode === CursorMode.Chat) {
        console.log(cursorState.message);
        setCursorState({
          mode: CursorMode.Chat,
          previousMessage: cursorState.message,
          message: "",
        });
      }
    } else if (e.key === "Escape") {
      setCursorState({
        mode: CursorMode.Hidden,
      });
    }
  };
  return (
    <div
      className="absolute top-0 left-0"
      style={{
        transform: `translateX(${cursor.x}px) translateY(${cursor.y}px)`,
      }}
    >
      {cursorState.mode === CursorMode.Chat && (
        <>
          <CursorSVG color={"#000"} />

          <div
            className="absolute left-2 top-5 bg-blue-500 leading-relaxed px-4 py-2 text-sm text-white rounded-[20px]"
            onKeyUp={(e) => e.stopPropagation()}
          >
            {cursorState.previousMessage && (
              <div>{cursorState.previousMessage}</div>
            )}

            <input
              type="text"
              value={cursorState.message}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={cursorState.previousMessage ? "" : "Type a message"}
              className="pl-1 z-10 w-60 bg-transparent border-none placeholder-blue-300 outline-none"
              autoFocus={true}
              maxLength={50}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default CursorChat;
