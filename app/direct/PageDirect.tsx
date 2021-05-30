import React from "react";
import Router from "next/router";

import { useRouter } from "next/router";
import { observer } from "mobx-react-lite";
import { applySnapshot } from "mobx-state-tree";
import { useDropzone } from "react-dropzone";

import styles from "./class.module.css";

import { DirectList } from "@models/direct/DirectList";
import { DirectMessagesList } from "@models/direct/DirectList";
import { RootStore } from "@store/RootStore";
import { Clsx, MuiButton, MuiScrollbar, MuiTextField } from "@components/core";
import { PaperclipIcon, ArrowIcon } from "@components/icons";
import { DirectTypingModel } from "@models/direct/DirectModel";

export const PageDirect = observer((props) => {
  const router = useRouter();
  const [direct] = React.useState(DirectList.create({ ...props["direct"] }));
  React.useEffect(() => {
    applySnapshot(direct, { ...props["direct"] });
  }, [props]);
  React.useEffect(() => {
    applySnapshot(messages, { ...props["messages"] });
  }, [props]);
  const [messages] = React.useState(
    DirectMessagesList.create({ ...props["messages"] })
  );
  const {
    open,
    getRootProps,
    getInputProps,
    acceptedFiles,
    isDragAccept,
  } = useDropzone({
    noClick: true,
    noKeyboard: true
  });

  const [model] = React.useState(DirectTypingModel.create());

  return (
    <div className={"flex flex-col flex-1"}>
      <div className={"flex flex-row flex-1 "}>
        <div className={"flex flex-col w-[400px] h-[100%] border-r"}>
          <h3 className={"text-xl font-medium ml-4"}>Сообщения</h3>
          <MuiScrollbar className={styles["scroll"]}>
            {direct["response"].map((row, index) => {
              const onClick = () =>
                Router.push({
                  pathname: router["pathname"],
                  query: { select: row["id"] },
                });

              return (
                <div
                  key={index}
                  onClick={onClick}
                  className={
                    "flex flex-row flex-initial justify-between items-center mx-5 py-3"
                  }
                >
                  {/* {row["id"]} */}
                  <div
                    className={
                      "w-16 h-16 rounded-full border-2 border-black overflow-hidden flex-none"
                    }
                  >
                    <img
                      src={row["reception_parts"].getPreview()}
                      className={"w-auto h-full object-cover"}
                    />
                  </div>
                  <div className={"ml-4 flex-1"}>
                    <div className={"flex flex-row justify-between"}>
                      <p
                        className={
                          "text-[9px] font-bold text-[#006FFF] uppercase"
                        }
                      >
                        {/* Что тут выводить??? */}
                        OOO AUTOSTOK
                      </p>
                      <time className={"text-[9px] text-[#1E1E1E]"}>
                        {formatDate(row["message"]["date_send"])}
                      </time>
                    </div>
                    <p className={"text-base font-bold"}>
                      {row["reception_parts"]["part_category"]["name"]}
                    </p>
                    <p className={"text-[10px] text-[#1E1E1E]"}>
                      {`Вы: ${lastMessage(row["message"]["content"])}`}
                    </p>
                  </div>
                </div>
              );
            })}
            {direct["response"].map((row, index) => {
              const onClick = () =>
                Router.push({
                  pathname: router["pathname"],
                  query: { select: row["id"] },
                });

              return (
                <div
                  key={index}
                  onClick={onClick}
                  className={
                    "flex flex-row flex-initial justify-between items-center mx-5 py-3"
                  }
                >
                  {/* {row["id"]} */}
                  <div
                    className={
                      "w-16 h-16 rounded-full border-2 border-black overflow-hidden flex-none"
                    }
                  >
                    <img
                      src={row["reception_parts"].getPreview()}
                      className={"w-auto h-full object-cover"}
                    />
                  </div>
                  <div className={"ml-4 flex-1"}>
                    <div className={"flex flex-row justify-between"}>
                      <p
                        className={
                          "text-[9px] font-bold text-[#006FFF] uppercase"
                        }
                      >
                        {/* Что тут выводить??? */}
                        OOO AUTOSTOK
                      </p>
                      <time className={"text-[9px] text-[#1E1E1E]"}>
                        {formatDate(row["message"]["date_send"])}
                      </time>
                    </div>
                    <p className={"text-base font-bold"}>
                      {row["reception_parts"]["part_category"]["name"]}
                    </p>
                    <p className={"text-[10px] text-[#1E1E1E]"}>
                      {`Вы: ${lastMessage(row["message"]["content"])}`}
                    </p>
                  </div>
                </div>
              );
            })}
          </MuiScrollbar>
        </div>
        <div className={"flex flex-col flex-1 relative"}>
          <MuiScrollbar className={"my-10"}>
            {messages["response"].map((row, index, arr) => {
              const isUser =
                RootStore["session"]["user"]["id"] === row["sender"]["id"];

              const notLast =
                row["sender"]["id"] === arr[index + 1]?.["sender"]["id"];

              return (
                <div
                  className={Clsx(styles["message"], {
                    [styles["message-right"]]: isUser,
                    [styles["message-left"]]: !isUser,
                    [styles["message-notlast"]]: notLast,
                  })}
                  key={index}
                  data-sender={isUser}
                >
                  {row["content"]}
                  <div
                    className={Clsx(styles["avatar"], {
                      [styles["avatar-right"]]: isUser,
                      [styles["avatar-left"]]: !isUser,
                    })}
                  >
                    <img
                      src={row["sender"].getPreview()}
                      className={"w-auto h-full object-cover"}
                    />
                  </div>
                  <p
                    className={Clsx(styles["company"], {
                      [styles["company-right"]]: isUser,
                      [styles["company-left"]]: !isUser,
                    })}
                  >
                    {/* Уточнить что тут выводить!!!! */}
                    {row["sender"]["first_name"]}
                  </p>
                  <time
                    className={Clsx(styles["time"], {
                      [styles["time-right"]]: isUser,
                      [styles["time-left"]]: !isUser,
                    })}
                  >
                    {formatTime(row["date_send"])}
                  </time>
                </div>
              );
            })}
          </MuiScrollbar>
          <div className={styles["input"]}>
            <input {...getInputProps()} />
            <MuiTextField
              className={styles["textinput"]}
              //  !!! Правильно?????
              value={model["message"]}
              onChange={(value) => model.changeControl("message", value)}
            />
            <MuiButton
              icon={<PaperclipIcon />}
              className={styles["icon"]}
              onClick={open}
            />
            <MuiButton
              label="ОТПРАВИТЬ"
              icon={<ArrowIcon />}
              className={styles["button"]}
              onClick={() => {
                // model.createModel();
              }}
            />
          </div>
          <div
            {...getRootProps({
              className: isDragAccept
                ? `${styles["dropzone"]} absolute left-36 right-36 top-96 bottom-32`
                : "absolute left-36 right-36 top-96 bottom-32 ",
            })}
          >
          </div>
        </div>
      </div>
    </div>
  );
});


function formatDate(date: string) {
  return new Date(date).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function lastMessage(str: string) {
  return str.length > 40 ? `${str.slice(0, 40)}...` : str.slice(0, 40);
}