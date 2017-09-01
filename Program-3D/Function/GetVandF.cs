using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.InteropServices;

namespace Program_3D.Function
{
    public class GetVandF
    {
        [DllImport("../bin/TG.dll", CallingConvention = CallingConvention.Winapi)]
        public extern static int ReVF(double[] pList, int[] fList, int pn, int fn,IntPtr outstruct);

        private List<Vertice> vertices;
        private List<Face> faces;
        public GetVandF(string StrVertices, string StrFaces)
        {
            vertices = ObjVertices(StrVertices);
            faces = ObjFaces(StrFaces);
        }
        public ResultVF TransformVF()
        {
            int verticesNum = vertices.Count();
            double[] verticeArray = new double[1000000];
            for (int i = 0; i < verticesNum; i++)
            {
                verticeArray[i * 3] = vertices[i].x;
                verticeArray[i * 3 + 1] = vertices[i].y;
                verticeArray[i * 3 + 2] = vertices[i].z;
            }

            int facesNum = faces.Count();
            int[] faceArray = new int[1000000];
            for (int i = 0; i < facesNum; i++)
            {
                faceArray[i * 3] = faces[i].a + 1;
                faceArray[i * 3 + 1] = faces[i].b + 1;
                faceArray[i * 3 + 2] = faces[i].c + 1;
            }

            VFStruct vfout = new VFStruct();
            IntPtr ptr = Marshal.AllocHGlobal(Marshal.SizeOf(vfout));
            Marshal.StructureToPtr(vfout,ptr,false);
             int flag = ReVF(verticeArray, faceArray, verticesNum, facesNum, ptr);
            vfout = (VFStruct)Marshal.PtrToStructure(ptr,typeof(VFStruct));

            int[] flist = new int[vfout.FN * 3];
            int tmpnum1;
            for (int i = 0; i < vfout.FN * 3; i++)
            {
                IntPtr pt = new IntPtr(vfout.FList.ToInt64() + 4 * i);
                tmpnum1 = (int)Marshal.PtrToStructure(pt, typeof(int));
                flist[i] = tmpnum1;
            }

            double[] plist = new double[vfout.PN * 3];
            double tmpnum2;
            for (int i = 0; i < vfout.PN * 3; i++)
            {
                IntPtr pt = new IntPtr(vfout.PList.ToInt64() + 8 * i);
                tmpnum2 = (double)Marshal.PtrToStructure(pt, typeof(double));
                plist[i] = tmpnum2;
            }

            List<Face> resultF = new List<Face>();
            for (int i = 0; i < vfout.FN; i++)
            {
                Face face = new Face { a = flist[i * 3] - 1 ,b= flist[i * 3 + 1] - 1 ,c = flist[i * 3 + 2] - 1 };
                resultF.Add(face);
            }
            List<Vertice> resultV = new List<Vertice>();
            for (int i = 0; i < vfout.PN; i++)
            {
                Vertice vertice = new Vertice { x = plist[i*3], y = plist[i * 3 + 1], z = plist[i * 3 + 2], };
                resultV.Add(vertice);
            }
            Marshal.FreeHGlobal(ptr);
            return new ResultVF { ResultV = resultV,ResultF = resultF};

        }


        public List<Vertice> ObjVertices(string StrVertices)
        {
            List<Vertice> vertices = new List<Vertice>();
            vertices = StringHandle.JSONStringToList<Vertice>(StrVertices.ToString());
            return vertices;

        }

        public List<Face> ObjFaces(string StrFaces)
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
        public struct VFStruct
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