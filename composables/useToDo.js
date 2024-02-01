import {v4 as uuid} from 'uuid';

const useToDo = () => {
    // -- For new ToDo -------------- //
    let tempToDoData = {
        title: '',
        description: '',
        uid: uuid(),
        orner_id: '',
        favorited: [],
    };

    // -- For new SubToDo -------------- //
    let tempSubToDoData = {
        todo_id: '',
        uid: uuid(),
        orner_id: '',
        title: '',
        description: '',
    };

    // --------------------------------------------------
    // read ToDo
    // --------------------------------------------------
    const {data: dataToDo} = useFetch('/api/todo');

    // --------------------------------------------------
    // createToDo
    // --------------------------------------------------
    const createToDo = async (values) => {
        console.log(values, 'create');
        let tempData = {};
        if (values.mode === 'create') {
            tempData = {...tempToDoData};
            tempData.title = values.data.title;
            tempData.description = values.data.description;
            tempData.orner_id = values.data.orner_id;
        } else if (values.mode === 'createSub') {
            tempData = {...tempSubToDoData};
            tempData.url = values.data.url;
            tempData.title = values.data.title;
            tempData.description = values.data.description;
            tempData.orner_id = values.data.orner_id;
            tempData.todo_id = values.data.todo_id;
        }

        // console.log('mode:', values.mode, 'data:', values.data);
        const data = await $fetch('/api/todo', {
            method: 'post',
            body: {mode: values.mode, data: tempData},
        });
        await refreshNuxtData();
        console.log(data);
        return data;
    };

    // --------------------------------------------------
    // updateToDo
    // --------------------------------------------------
    const updateToDo = async (values) => {
        console.log(values, 'update');
        const data = await $fetch('/api/todo', {
            method: 'put',
            body: {mode: values.mode, data: values.data, targetId: values.targetId},
        });
        console.log(data);
        // ↓Cannot be executed as it will be executed twice
        // const data = await useFetch('/api', { method: 'post', body: values, server: false });
        await refreshNuxtData();
        return data;
    };
    // --------------------------------------------------
    // fav,save
    // --------------------------------------------------
    const changeStatus = async (values) => {
        console.log('changeStatus', values);
        let temp = {};
        if (values.mode === 'deleteFav') {
            // -- Remove userId from todo.favorited -------------- //
            let tempFavorited = values.todoData.data.favorited;
            let resultFavorited = tempFavorited.filter((v) => {
                return v !== values.userData.id;
            });

            // -- Delete todoId from users.favorit -------------- //
            let tempFavorite = values.userData.data.favorite;
            let resultFavorite = tempFavorite.filter((v) => {
                return v !== values.todoData.id;
            });

            temp = {
                mode: values.mode,
                data: {
                    targetId: values.todoData.id, // Liked ToDoId
                    ornerId: values.userData.id, // UserId who liked it
                    favorited: resultFavorited, // Liker json list
                    favorite: resultFavorite, // json list that I liked
                },
            };
            // console.log(resultFav);
        } else if (values.mode === 'addFav') {
            // -- Remove userId from todo.favorited -------------- //
            let tempFavorited = values.todoData.data.favorited;
            tempFavorited.push(values.userData.id);

            // -- Delete todoId from users.favorit -------------- //
            let tempFavorite = values.userData.data.favorite;
            tempFavorite.push(values.todoData.id);

            temp = {
                mode: values.mode,
                data: {
                    targetId: values.todoData.id, // Liked ToDoId
                    ornerId: values.userData.id, // UserId who liked it
                    favorited: tempFavorited, // Liker json list
                    favorite: tempFavorite, // json list that I liked
                },
            };
        }
        console.log(temp);

        const data = await $fetch('/api/todo', {
            method: 'put',
            body: temp,
        });
        await refreshNuxtData();
        return data;
    };

    // --------------------------------------------------
    // deleteToDo
    // --------------------------------------------------
    const deleteToDo = async (values) => {
        console.log(values, 'delete');
        const data = await $fetch('/api/todo', {
            method: 'delete',
            body: {mode: values.mode, id: values.id},
        });

        await refreshNuxtData();
        return data;
    };
    return {
        dataToDo,
        createToDo,
        updateToDo,
        deleteToDo,
        changeStatus,
    };
};
export default useToDo;
