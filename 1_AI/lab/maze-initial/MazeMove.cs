using numl.AI;

namespace Games
{
    public class MazeMove : ISuccessor
    {
        public MazeMove(IState state, string action)
        {
            State = state;
            Action = action;
        }

        public string Action { get; set; }

        public double Cost { get; set; }

        public IState State { get; set; }

        public Maze GetState() => State as Maze;
    }
}
