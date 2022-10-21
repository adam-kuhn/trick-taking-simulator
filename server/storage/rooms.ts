class GameRooms {
  private roomAndCodes: Record<string, string> = {};

  get roomNames() {
    return Object.keys(this.roomAndCodes);
  }

  getRoomCode(room: string) {
    return this.roomAndCodes[room];
  }

  addNewRoom(newRoom: string, code: string): void {
    this.roomAndCodes = {
      ...this.roomAndCodes,
      [newRoom]: code,
    };
  }
}

export default new GameRooms();
