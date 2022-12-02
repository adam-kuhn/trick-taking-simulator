// naive code. If this ever ended up on multiple servers this wouldn't work
// rooms are grouped as { [room name]: code }
class GameRooms {
  private roomAndCodes: Record<string, string> = {};

  get roomNames() {
    return Object.keys(this.roomAndCodes);
  }

  getAllRoomsAndCodes(): Record<string, string> {
    return this.roomAndCodes;
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
