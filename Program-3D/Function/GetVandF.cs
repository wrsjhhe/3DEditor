using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.InteropServices;

namespace Program_3D.Function
{
    public class GetVandF
    {
        [DllImport("../../Debug/TG.dll", CallingConvention = CallingConvention.Winapi)]
        public extern static int ReVF(double[] pList, int[] fList, int pn, int fn,IntPtr outstruct);

        private List<Vertice> vertices;
        private List<Face> faces;
        public GetVandF(string StrVertices, string StrFaces)
        {
            vertices = ObjVertices(StrVertices);
            faces = ObjFaces(StrFaces);
        }
        public void TransformVF()
        {
            int verticesNum = vertices.Count();
            double[] verticeArray = new double[verticesNum * 3];
            for (int i = 0; i < verticesNum; i++)
            {
                verticeArray[i * 3] = vertices[i].x;
                verticeArray[i * 3+1] = vertices[i].y;
                verticeArray[i * 3+2] = vertices[i].z;
            }

            int facesNum = faces.Count();
            int[] faceArray = new int[facesNum*3];
            for (int i = 0; i < facesNum; i++)
            {
                faceArray[i * 3] = faces[i].a + 1;
                faceArray[i * 3+1] = faces[i].b + 1;
                faceArray[i * 3+2] = faces[i].c + 1;
            }
            double[] va = { 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1 };
            int[] fa = { 1, 2, 3, 1, 3, 4, 1, 2, 4, 2, 3, 4 };

            VFStruct vfout = new VFStruct();
            IntPtr ptr = Marshal.AllocHGlobal(Marshal.SizeOf(vfout));
            Marshal.StructureToPtr(vfout,ptr,false);           
           // int aaaa = ReVF(va,fa,4,4,ptr);
            int aaaa = ReVF(verticeArray, faceArray, verticesNum, facesNum, ptr);
            vfout = (VFStruct)Marshal.PtrToStructure(ptr,typeof(VFStruct));
            int[] flist = new int[30];
            int num;
            for (int i = 0; i < 30; i++)
            {
                IntPtr pt = new IntPtr(vfout.FList.ToInt32() + 4 * i);
                num = (int)Marshal.PtrToStructure(pt, typeof(int));
                flist[i] = num;
            }
            int[] arr = flist;
       //     int aaaa = ReVF(verticeArray, faceArray, verticesNum, facesNum);

        }


        private List<Vertice> ObjVertices(string StrVertices)
        {
            List<Vertice> vertices = new List<Vertice>();
            vertices = StringHandle.JSONStringToList<Vertice>(StrVertices.ToString());
            return vertices;

        }

        private List<Face> ObjFaces(string StrFaces)
        {
            List<Face> faces = new List<Face>();
            faces = StringHandle.JSONStringToList<Face>(StrFaces.ToString());
            return faces;
        }
        class Face
        {
            public int a { get; set; }
            public int b { get; set; }
            public int c { get; set; }

        }
        class Vertice
        {
            public double x { get; set; }
            public double y { get; set; }
            public double z { get; set; }
        }
        [StructLayout(LayoutKind.Explicit)]
        public struct VFStruct
        {
            [FieldOffset(0)]
             public IntPtr FList;
            [FieldOffset(4)]
             public int FN;
          
        }
    }

}