function generateMeetingLink() {
    const meetingId = Math.random().toString(36).substring(2, 10);
    return `https://meet.google.com/${meetingId}`;
  }


export {
    generateMeetingLink
}