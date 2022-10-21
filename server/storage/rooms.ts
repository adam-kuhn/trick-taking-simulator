class GameRooms {
  private roomAndCodes: Record<string, string> = {};

  get roomNames() {
    return Object.keys(this.roomAndCodes);
  }

  addNewRoom(newRoom: string, code: string): void {
    this.roomAndCodes = {
      ...this.roomAndCodes,
      [newRoom]: code,
    };
  }
}

export default new GameRooms();
