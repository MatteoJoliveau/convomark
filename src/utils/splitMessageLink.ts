function splitMessageLink(link: string): { chatUsername: string, messageId: number } {
    const [,,, chatUsername, messageId] = link.split('/');
    return { chatUsername, messageId: parseInt(messageId) };
}

export default splitMessageLink;