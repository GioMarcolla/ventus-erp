const waitFor = async (delay: number) => {
    await new Promise(resolve => setTimeout(resolve, delay));
};

export default waitFor;
