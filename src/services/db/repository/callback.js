import Callback from "../modelsXschema/callback.js";

const getCallbacks = async () => {
    return await Callback.find().lean();
};

const addCallback = async (data) => {
    return await Callback.create(data);
};


export { getCallbacks, addCallback };