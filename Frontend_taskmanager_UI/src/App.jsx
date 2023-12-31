import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "../../Frontend_taskmanager_UI/src/components/Navbar/Navbar";
import Board from "../../Frontend_taskmanager_UI/src/components/Board/Board";
import { DragDropContext } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
// import Editable from "../src/components/Editable/Editable";
import useLocalStorage from "use-local-storage";
import "../bootstrap.css";
function App() {
  const [data, setData] = useState(
    [
          {
            id: uuidv4(),
            boardName: "Backlog",
            card: [],
          },
          {
            id: uuidv4(),
            boardName: "In Progress",
            card: [],
          },
          {
            id: uuidv4(),
            boardName: "Completed",
            card: [],
          },
      ]
  );

  const defaultDark = window.matchMedia(
    "(prefers-colors-scheme: dark)"
  ).matches;
  const [theme, setTheme] = useLocalStorage(
    "theme",
    defaultDark ? "dark" : "light"
  );

  const switchTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // const setName = (title, bid) => {
    
  //   const index = data.findIndex((item) => item.id === bid);
  //   const tempData = [...data];
  //   tempData[index].boardName = title;
  //   setData(tempData);
  // };

  const dragCardInBoard = (source, destination) => {
    let tempData = [...data];
    const destinationBoardIdx = tempData.findIndex(
      (item) => item.id.toString() === destination.droppableId
    );
    const sourceBoardIdx = tempData.findIndex(
      (item) => item.id.toString() === source.droppableId
    );
    tempData[destinationBoardIdx].card.splice(
      destination.index,
      0,
      tempData[sourceBoardIdx].card[source.index]
    );
    tempData[sourceBoardIdx].card.splice(source.index, 1);

    return tempData;
  };

  // const dragCardInSameBoard = (source, destination) => {
  //   let tempData = Array.from(data);
  //   const index = tempData.findIndex(
  //     (item) => item.id.toString() === source.droppableId
  //   );
  //   let [removedCard] = tempData[index].card.splice(source.index, 1);
  //   tempData[index].card.splice(destination.index, 0, removedCard);
  //   setData(tempData);
  // };

  const addCard = (cardData, bid) => {
    const index = data.findIndex((item) => item.id === bid);
    const tempData = [...data];
    tempData[index].card.push({
      id: uuidv4(),
      title: cardData.title,
      description: cardData.description,
      deadline: cardData.deadline,
    });
    setData(tempData);
  };

  const removeCard = (boardId, cardId) => {
    const index = data.findIndex((item) => item.id === boardId);
    const tempData = [...data];
    const cardIndex = data[index].card.findIndex((item) => item.id === cardId);

    tempData[index].card.splice(cardIndex, 1);
    setData(tempData);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId) return;

    setData(dragCardInBoard(source, destination));
  };

  const updateCard = (bid, cid, card) => {
    const index = data.findIndex((item) => item.id === bid);
    if (index < 0) return;

    const tempBoards = [...data];
    const cards = tempBoards[index].card;

    const cardIndex = cards.findIndex((item) => item.id === cid);
    if (cardIndex < 0) return;

    tempBoards[index].card[cardIndex] = card;
    console.log('tempboard:',tempBoards);
    setData(tempBoards);
  };

  useEffect(() => {
    localStorage.setItem("board", JSON.stringify(data));
  }, [data]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="App" data-theme={theme}>
        <Navbar switchTheme={switchTheme} />
        <div className="app_outer">
          <div className="app_boards">
            {data.map((item) => (
              <Board
                key={item.id}
                id={item.id}
                name={item.boardName}
                card={item.card}
                // setName={setName}
                addCard={addCard}
                removeCard={removeCard}
                // removeBoard={removeBoard}
                updateCard={updateCard}
              />
            ))}
            {/* <Editable
              class={"add__board"}
              name={"Add Board"}
              btnName={"Add Board"}
              onSubmit={addBoard}
              placeholder={"Enter Board Title"}
            /> */}
          </div>
        </div>
      </div>
    </DragDropContext>
  );
}

export default App;
