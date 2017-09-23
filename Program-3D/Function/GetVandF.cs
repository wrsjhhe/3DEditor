using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.InteropServices;

namespace Program_3D.Function
{
    public class GetVandF
    {
        private List<Vertice> vertices;
        private List<Face> faces;
        protected double[] verticeArray;
        protected int[] faceArray;
        protected int verticesNum, facesNum;


        public GetVandF(string StrVertices, string StrFaces)
        {
            vertices = ObjVertices(StrVertices);
            faces = ObjFaces(StrFaces);
        }

        protected void StringToArray()
        {
            verticesNum = vertices.Count();
            verticeArray = new double[1000000];
            for (int i = 0; i < verticesNum; i++)
            {
                verticeArray[i * 3] = vertices[i].x;
                verticeArray[i * 3 + 1] = vertices[i].y;
                verticeArray[i * 3 + 2] = vertices[i].z;
            }

            facesNum = faces.Count();
            faceArray = new int[1000000];
            for (int i = 0; i < facesNum; i++)
            {
                faceArray[i * 3] = faces[i].a;
                faceArray[i * 3 + 1] = faces[i].b;
                faceArray[i * 3 + 2] = faces[i].c;
            }
        }



        protected List<Vertice> ObjVertices(string StrVertices)
        {
            List<Vertice> vertices = new List<Vertice>();
            vertices = StringHandle.JSONStringToList<Vertice>(StrVertices.ToString());
            return vertices;

        }

        protected List<Face> ObjFaces(string StrFaces)
        {
            List<Face> faces = new List<Face>();
            faces = StringHandle.JSONStringToList<Face>(StrFaces.ToString());
            return faces;
        }
        public class Face
        {
            public int a { get; set; }
            public int b { get; set; }
            public int c { get; set; }

        }
        public class Vertice
        {
            public double x { get; set; }
            public double y { get; set; }
            public double z { get; set; }
        }
        [StructLayout(LayoutKind.Explicit)]
        protected struct VFStruct
        {
            [FieldOffset(0)]
            public IntPtr FList;
            [FieldOffset(4)]
            public int FN;
            [FieldOffset(8)]
            public IntPtr PList;
            [FieldOffset(12)]
            public int PN;

        }

        public struct ResultVF
        {
            public List<Vertice> ResultV;

            public List<Face> ResultF;
        }
    }

}