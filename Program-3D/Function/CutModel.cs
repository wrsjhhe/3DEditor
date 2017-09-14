using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Web;

namespace Program_3D.Function
{
    public class CutModel : GetVandF
    {
        [DllImport("../../Debug/CGALModule.dll", CallingConvention = CallingConvention.Winapi)]
        public extern static double Cut(double[] pList, int[] fList, int pn, int fn, double[] m, int[] fout1, int[] fout2, int[] sides, int[] outpn);
        public CutModel(string StrVertices, string StrFaces) : base(StrVertices, StrFaces)
        {
            StringToArray();
        }

        public FaceOut Cutting()
        {
            double[] m = { 1, 0, 0, 0, 1, 0, 0, 0, 0 };
            int[] fout1 = new int[1000000];
            int[] fout2 = new int[1000000];
            int[] sides = new int[2];
            int[] outpn = new int[1];
            double flag = Cut(verticeArray, faceArray, verticesNum, facesNum, m, fout1, fout2, sides, outpn);
            int numofside1 = sides[0];
            int numofside2 = sides[1];
            List<Face> resultF1 = new List<Face>();
            List<Face> resultF2 = new List<Face>();
            List<Vertice> resultV = new List<Vertice>();
            for (int i = 0; i < numofside1; i++)
            {
                Face face = new Face { a = fout1[i * 3], b = fout1[i * 3 + 1], c = fout1[i * 3 + 2] };
                resultF1.Add(face);
            }
            for (int i = 0; i < numofside2; i++)
            {
                Face face = new Face { a = fout2[i * 3], b = fout2[i * 3 + 1], c = fout2[i * 3 + 2] };
                resultF2.Add(face);
            }
            for (int i = 0; i < outpn[0]; i++)
            {
                Vertice vertice = new Vertice { x = verticeArray[i * 3], y = verticeArray[i * 3 + 1], z = verticeArray[i * 3 + 2] };
                resultV.Add(vertice);
            }
            return new FaceOut
            {
                ResultV = resultV,
                ResultF1 = resultF1,
                ResultF2 = resultF2
            };
        }

        public struct FaceOut
        {
            public List<Vertice> ResultV;
            public List<Face> ResultF1;
            public List<Face> ResultF2;
        }

    }
}