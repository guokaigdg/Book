import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
// import { DragView } from '../index';
import { DragUserWorkView } from "../DragUserWorkView";
import { Divider } from "../Divider";

const useStyle = makeStyles({
  droppedcontent: {
    paddingTop: 4,
    cursor: "pointer",
  },
  droppingContent: {
    paddingTop: 4,
    boxShadow: "0px -2px 0px rgba(139, 199, 219, 1)",
    cursor: "pointer",
  },
});

interface draggleProps {
  data: any;
  sortKey: string;
  codeKey: string;
  onClick: any;
  chooseditem?: any;
}

function DraggableDragUserWork(props: draggleProps) {
  const classes = useStyle();
  const { data, sortKey, codeKey, onClick, chooseditem } = props;
  const [newValue, setNewValue] = useState(data);
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    refresh && setTimeout(() => setRefresh(false));
  }, [refresh]);
  const S4 = () => {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  const guid = () => {
    return (
      S4() +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      S4() +
      S4()
    );
  };
  let uId = guid();
  // 拖动事件
  const domdrugstart = (sort: any, code: any, uId: any, item: any, e: any) => {
    e.dataTransfer.setData("code", code);
    e.dataTransfer.setData("uId", uId);
    e.dataTransfer.setData("item", JSON.stringify(item));
    e.dataTransfer.setData("sort", sort);
  };
  // 拖动后鼠标进入另一个可接受区域 ok
  const dragenter = (e: any) => {
    if (e.target.className.indexOf("droppedcontent") !== -1) {
      e.target.className = classes.droppingContent;
    }
  };
  // a拖到b，离开b的时候触发  ok
  const dragleave = (e: any) => {
    if (e.target.className.indexOf("droppingContent") !== -1) {
      e.target.className = classes.droppedcontent;
    }
  };
  // 对象排序
  function compare(key: any) {
    return (obj1: any, obj2: any) => {
      if (obj1[key] < obj2[key]) {
        return -1;
      } else if (obj1[key] > obj2[key]) {
        return 1;
      }
      return 0;
    };
  }
  // 当一个元素或是选中的文字被拖拽释放到一个有效的释放目标位置时
  const drop = (
    dropedSort: any,
    data: any,
    sortKey: any,
    dropedUid: any,
    codeKey: any,
    e: any
  ) => {
    e.preventDefault();
    const code = e.dataTransfer.getData("code");
    const uId = e.dataTransfer.getData("uId");
    const sort = e.dataTransfer.getData("sort");
    if (uId === dropedUid) {
      if (sort < dropedSort) {
        data.map((item: any) => {
          if (item[codeKey] === code) {
            item[sortKey] = dropedSort;
          } else if (item[sortKey] > sort && item[sortKey] < dropedSort + 1) {
            item[sortKey]--;
          }
          return item;
        });
      } else {
        data.map((item: any) => {
          if (item[codeKey] === code) {
            item[sortKey] = dropedSort;
          } else if (item[sortKey] > dropedSort - 1 && item[sortKey] < sort) {
            item[sortKey]++;
          }
          return item;
        });
      }
    }
    // 拖拽后更新数据
    setNewValue(data);
    setRefresh(true);

    if (e.target.className.indexOf("droppingContent") !== -1) {
      // e.target.className = styles.droppedcontent;
      e.target.style.paddingTop = 4;
      e.target.style.cursor = "pointer";
      e.target.style.boxShadow = "";
    }
  };
  const allowDrop = (e: any) => {
    e.preventDefault();
  };

  // 生成拖拽组件
  const createDraggleComponent = (
    data: any,
    sortKey: any,
    uId: any,
    codeKey: any
  ) => {
    return data.sort(compare(sortKey)).map((item: any, index: number) => {
      return (
        <div
          className={classes.droppedcontent}
          key={item[codeKey] + Math.random()}
          draggable={true}
          onDragEnter={dragenter}
          onDragLeave={dragleave}
          onDragStart={(e) =>
            domdrugstart(item[sortKey], item[codeKey], uId, item, e)
          }
          onDrop={(e) => drop(item[sortKey], data, sortKey, uId, codeKey, e)}
          onDragOver={allowDrop}
        >
          {item.workspaceId === chooseditem ? (
            <DragUserWorkView
              index={index}
              data={item}
              choosed={true}
              emoji={item.icon}
              text={item.name}
              desc={item.desc}
              onClick={onClick}
            />
          ) : (
            <DragUserWorkView
              index={index}
              data={item}
              choosed={false}
              emoji={item.icon}
              text={item.name}
              desc={item.desc}
              onClick={onClick}
            />
          )}
          <Divider />
        </div>
      );
    });
  };

  return (
    <div>
      <div
        style={{ display: "flex", flexDirection: "column", flexWrap: "wrap" }}
      >
        {createDraggleComponent(newValue, sortKey, uId, codeKey)}
      </div>
    </div>
  );
}
export default DraggableDragUserWork;
