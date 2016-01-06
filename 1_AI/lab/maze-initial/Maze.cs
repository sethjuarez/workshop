using numl.AI;
using System.Collections.Generic;
using System;
using System.Text;

namespace Games
{
    public class Maze : IState
    {
        readonly static string[] moves = new[] { "Left", "Right", "Up", "Down" };
        readonly static Func<Tuple<int, int>, Tuple<int, int>>[] moveActions = new Func<Tuple<int, int>, Tuple<int, int>>[] {
            x => ChangePosition(x, -1, 0),
            x => ChangePosition(x, 1, 0),
            x => ChangePosition(x, 0, -1),
            x => ChangePosition(x, 0, 1)
       };

        readonly char[,] data;
        readonly Tuple<int, int> position;
        readonly Tuple<int, int> end;

        public Maze(char[,] data, Tuple<int, int> position, Tuple<int, int> end)
        {
            this.data = data;
            this.position = position;
            this.end = end;

            IsTerminal = AreEqual(position, end);
        }

        public string Id { get; set; }

        public bool IsTerminal { get; private set; }

        public double Heuristic() =>
            Math.Abs(position.Item1 - end.Item1) +
                Math.Abs(position.Item2 - end.Item2);

        public IEnumerable<ISuccessor> GetSuccessors()
        {
            for (int i = 0; i < 4; i++)
            {
                var newPosition = moveActions[i](position);
                if (CharacterAt(newPosition) == ' ') {
                    yield return new MazeMove(new Maze(data, newPosition, end), moves[i]);
                }
            }
        }

        public bool IsEqualTo(IState maze) =>
            AreEqual(position, ((Maze) maze).position);

        public override string ToString()
        {
            var buffer = new StringBuilder();

            for (int i = 0; i < data.GetLength(1); i++)
            {
                for (int j = 0; j < data.GetLength(0); j++)
                {
                    buffer.Append(PrintCharacterAt(Tuple.Create(j, i)));
                }

                buffer.Append(Environment.NewLine);
            }

            return buffer.ToString();
        }

        private char PrintCharacterAt(Tuple<int, int> location) {
            if (AreEqual(location, position)) {
                return 'O';
            }
            else if (AreEqual(location, end)) {
                return 'X';
            }

            return CharacterAt(location);
        }

        private static Tuple<int, int> ChangePosition(Tuple<int, int> location, int xChange, int yChange) =>
            Tuple.Create(location.Item1 + xChange, location.Item2 + yChange);

        private char CharacterAt(Tuple<int, int> location) =>
            data[location.Item1, location.Item2];

        private bool AreEqual(Tuple<int, int> x, Tuple<int, int> y) =>
            x.Item1 == y.Item1 && x.Item2 == y.Item2;
    }
}
