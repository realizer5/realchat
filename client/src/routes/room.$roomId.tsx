import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";

export const Route = createFileRoute("/room/$roomId")({
  component: RoomComponent,
});

interface IMessage {
  username: string;
  message: string;
}

function RoomComponent() {
  const [msgout, setMsgout] = useState("");
  const [msgin, setMsgin] = useState<IMessage[]>([
    { username: "room", message: "room created" },
  ]);
  const divRef = useRef<HTMLDivElement>(null);
  const { roomId } = Route.useParams();
  const ws = useRef<WebSocket>(null);

  useEffect(() => {
    ws.current = new WebSocket(
      `ws://localhost:8000/room?roomId=${roomId}&username=realizer`,
    );
    ws.current.onopen = () => {
      console.log("WebSocket Client Connected");
    };

    ws.current.onmessage = (e) => {
      console.log(e.data);
      const data = JSON.parse(e.data);
      setMsgin((prev) => [
        ...prev,
        {
          username: data.username,
          message: data.message,
        },
      ]);
    };
    return () => ws.current?.close();
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setMsgout("");
    if (divRef.current) divRef.current.innerText = "";
    if (msgout.trim() === "") return;
    ws.current?.send(msgout);
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const text = e.currentTarget.innerText;
    setMsgout(text.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };
  return (
    <>
      <div className="flex-1 overflow-scroll flex flex-col-reverse">
        <ol>
          {msgin.map((item) => (
            <div>{item.username + " : " + item.message}</div>
          ))}
        </ol>
      </div>
      <form
        onSubmit={handleSubmit}
        className="border border-zinc-400 min-h-12 rounded-md mb-4 mx-2 flex items-center text-black group focus-within:border-zinc-200 transition-colors duration-200"
      >
        <div className="flex-1">
          {!msgout && (
            <div
              className="text-zinc-400 select-none absolute mx-4 my-2 text-sm"
              aria-hidden="true"
            >
              Type your message here...
            </div>
          )}
          <div
            ref={divRef}
            className="text-sm whitespace-pre-wrap wrap-break-word flex-1 outline-none px-4 py-2 relative z-10 max-h-[40vh] overflow-scroll scroll-pb-2"
            role="textarea"
            aria-multiline="true"
            aria-invalid="false"
            spellCheck="true"
            autoCorrect="off"
            contentEditable="true"
            suppressContentEditableWarning
            onInput={handleInput}
            onKeyDown={handleKeyDown}
          ></div>
        </div>
        <div className="h-full flex py-3">
          <div className="border border-zinc-400 h-6 mr-4"></div>
          <button
            type="submit"
            disabled={!msgout}
            className={`h-fit flex items-center justify-center group mr-4
                    ${msgout ? "text-blue-400 cursor-pointer" : "text-zinc-400 cursor-not-allowed"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-colors duration-200"
            >
              <path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z" />
              <path d="M6 12h16" />
            </svg>
          </button>
        </div>
      </form>
    </>
  );
}
